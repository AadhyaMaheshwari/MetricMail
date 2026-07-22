import express from 'express';
import { google } from 'googleapis';
import User from '../models/User.js';
import LABEL_RULES from './labelRules.js';
import { classifyEmail } from './classifier.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { trashEmails } from '../controllers/gmailController.js';
const router = express.Router(); 
router.post('/trash', authMiddleware, trashEmails);
router.use(authMiddleware);

async function getGmailClient(userId) {
  const user = await User.findById(userId);
  if (!user?.googleAccessToken) throw new Error('Gmail not connected');

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({
    access_token:  user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// ── POST /api/labels/setup — create all 7 labels in Gmail (run once) ────────
router.post('/setup', async (req, res) => {
  try {
    const gmail = await getGmailClient(req.user.id);

    const { data: existing } = await gmail.users.labels.list({ userId: 'me' });

    console.log("Existing labels:", existing.labels.map(l => l.name)); // 👈 DEBUG

    const existingLabels = existing.labels || [];

const normalize = (s) => s.trim().toLowerCase();

const existingMap = new Map(
  existingLabels.map(l => [normalize(l.name), l.id])
);
    const created = {};

    for (const rule of LABEL_RULES) {
  console.log("Processing:", rule.name);

  if (existingMap.has(normalize(rule.name))) {
    console.log("Already exists:", rule.name);
    created[rule.key] = existingMap.get(normalize(rule.name));
    continue;
  }

  console.log("Creating:", rule.name);

  const { data: label } = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
  name: rule.name,
  labelListVisibility: 'labelShow',
  messageListVisibility: 'show',
},
  });
  created[rule.key] = label.id;
}
    console.log("Final created object:", created); // 👈 MOST IMPORTANT

    await User.findByIdAndUpdate(
  req.user.id,
  { $set: { labelIds: created } },
  { new: true }
);

    res.json({ success: true, labels: created });

  } catch (err) {
    console.error("SETUP ERROR:", err); // 👈 MUST SEE THIS
    res.status(500).json({ error: err.message });
  }
});
// ── GET /api/labels/scan?maxEmails=500 ───────────────────────────────────────
router.get('/scan', async (req, res) => {
  try {
    const gmail     = await getGmailClient(req.user.id);
    const maxEmails = Math.min(parseInt(req.query.maxEmails) || 500, 10000);

    let messageIds = [];
    let pageToken  = null;
    do {
      const { data } = await gmail.users.messages.list({
        userId: 'me', maxResults: 500,
        pageToken: pageToken || undefined,
        labelIds: ['INBOX'],
      });
      if (data.messages) messageIds.push(...data.messages.map(m => m.id));
      pageToken = data.nextPageToken;
    } while (pageToken && messageIds.length < maxEmails);

    messageIds = messageIds.slice(0, maxEmails);

    const preview = {};
    LABEL_RULES.forEach(r => { preview[r.key] = []; });

    const BATCH = 50;
    for (let i = 0; i < messageIds.length; i += BATCH) {
      const results = await Promise.all(
        messageIds.slice(i, i + BATCH).map(id =>
          gmail.users.messages.get({
            userId: 'me', id,
            format: 'metadata',
            metadataHeaders: ['From', 'Subject', 'List-Unsubscribe'],
          })
        )
      );
      for (const { data: msg } of results) {
        const key = classifyEmail(msg.payload.headers || []);
        if (key) preview[key].push(msg.id);
      }
    }

    const summary = {};
    for (const rule of LABEL_RULES) {
      summary[rule.key] = {
        name:   rule.name,
        count:  preview[rule.key].length,
        policy: rule.policy,
        ids:    preview[rule.key],
      };
    }

    res.json({ success: true, scanned: messageIds.length, summary, results: summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/labels/apply ───────────────────────────────────────────────────
router.post('/apply', async (req, res) => {
  try {
    const gmail = await getGmailClient(req.user.id);
    const user = await User.findById(req.user.id);
    const { results } = req.body;

    const labelIds = user?.labelIds || {};

    if (!Object.keys(labelIds).length) {
      return res.status(400).json({ error: 'Run Setup first' });
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const applyLabelBatch = async (ids, labelId) => {
      const BATCH_SIZE = 500;
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = ids.slice(i, i + BATCH_SIZE);
        await gmail.users.messages.batchModify({
          userId: 'me',
          requestBody: {
            ids: batch,
            addLabelIds: [labelId],
          },
        });
        if (i + BATCH_SIZE < ids.length) await sleep(300);
      }
    };

    const report = {};

    for (const rule of LABEL_RULES) {
      const labelId = labelIds[rule.key];
      const ids = results?.[rule.key]?.ids || [];

      if (!ids.length || !labelId) {
        report[rule.key] = 0;
        continue;
      }

      await applyLabelBatch(ids, labelId);
      report[rule.key] = ids.length;
    }

    res.json({ success: true, applied: report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ── POST /api/labels/delete ──────────────────────────────────────────────────
router.post('/delete', async (req, res) => {
  try {
    const { labelKey, permanent = false } = req.body;

    if (labelKey === 'bank' && permanent)
      return res.status(403).json({ error: 'Cannot permanently delete Bank & Finance emails.' });

    const gmail  = await getGmailClient(req.user.id);
    const user   = await User.findById(req.user.id);
    const labelId = user?.labelIds?.[labelKey];
    if (!labelId) return res.status(400).json({ error: 'Label not found. Run /setup first.' });

    let messageIds = [];
    let pageToken  = null;
    do {
      const { data } = await gmail.users.messages.list({
        userId: 'me', labelIds: [labelId], maxResults: 500,
        pageToken: pageToken || undefined,
      });
      if (data.messages) messageIds.push(...data.messages.map(m => m.id));
      pageToken = data.nextPageToken;
    } while (pageToken);

    if (!messageIds.length)
      return res.json({ success: true, deleted: 0 });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // FIX: was missing, caused ReferenceError

    if (permanent) {
      for (let i = 0; i < messageIds.length; i += 1000)
        await gmail.users.messages.batchDelete({
          userId: 'me',
          requestBody: { ids: messageIds.slice(i, i + 1000) },
        });
    } else {
      // FIX: was `for (const msg of results)` — `results` never existed in this
      // function's scope. Now correctly iterates the messageIds we just fetched,
      // and moves each message to Trash (adds TRASH, removes the custom label)
      // instead of re-adding the same label being "deleted", which did nothing.
      for (const messageId of messageIds) {
        await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            addLabelIds: ['TRASH'],
            removeLabelIds: [labelId],
          },
        });
        await sleep(50); // prevents rate limit
      }
    }

    res.json({ success: true, deleted: messageIds.length, permanent, labelKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/labels/list ─────────────────────────────────────────────────────
router.get('/list', async (req, res) => {
  try {
    const gmail  = await getGmailClient(req.user.id);
    const user   = await User.findById(req.user.id);
    const ourIds = new Set(Object.values(user?.labelIds || {}));

    const { data } = await gmail.users.labels.list({ userId: 'me' });
    const ours     = data.labels.filter(l => ourIds.has(l.id));

    const details = await Promise.all(
      ours.map(l => gmail.users.labels.get({ userId: 'me', id: l.id }))
    );

    res.json({
      success: true,
      labels: details.map(({ data: l }) => ({
        id: l.id, name: l.name, color: l.color,
        messagesTotal: l.messagesTotal, messagesUnread: l.messagesUnread,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
