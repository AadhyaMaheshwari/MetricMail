import { google } from 'googleapis';
import User from '../models/User.js';

const DEFAULT_LABELS = {
  unread:     'UNREAD',
  spam:       'SPAM',
  promotions: 'CATEGORY_PROMOTIONS',
  sent:       'SENT',
  inbox:      'INBOX',
  social:     'CATEGORY_SOCIAL',
  updates:    'CATEGORY_UPDATES',    
};

function buildOAuthClientForUser(user) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  client.on('tokens', async (newTokens) => {
    try {
      if (newTokens.access_token) user.googleAccessToken = newTokens.access_token;
      if (newTokens.refresh_token) user.googleRefreshToken = newTokens.refresh_token;
      await user.save();
    } catch (err) {
      console.error('Failed to persist refreshed Google tokens:', err.message);
    }
  });

  return client;
}

async function getLabelCount(gmail, labelId) {
  const response = await gmail.users.labels.get({ userId: 'me', id: labelId });
  return response.data.messagesTotal || 0;
}

async function getAllStats(user) {
  if (!user.gmailConnected) throw new Error('Gmail is not connected for this user');

  const oauthClient = buildOAuthClientForUser(user);
  const gmail = google.gmail({ version: 'v1', auth: oauthClient });

  const labelEntries = Object.entries(DEFAULT_LABELS);
  const counts = await Promise.all(
    labelEntries.map(([, labelId]) => getLabelCount(gmail, labelId))
  );

  const stats = {};
  labelEntries.forEach(([friendlyName], index) => {
    stats[friendlyName] = counts[index];
  });

  return stats;
}

async function getRecentEmails(user) {
  const oauthClient = buildOAuthClientForUser(user);
  const gmail = google.gmail({ version: 'v1', auth: oauthClient });

  const response = await gmail.users.messages.list({ userId: 'me', maxResults: 15 });
  const messages = response.data.messages || [];

  return Promise.all(
    messages.map(async (message) => {
      const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
      const headers = email.data.payload.headers;
      return {
        from: headers.find(h => h.name === 'From')?.value || '',
        subject: headers.find(h => h.name === 'Subject')?.value || '',
      };
    })
  );
}

export const trashEmailsService = async (user, labelKey) => {
  if (!user.gmailConnected) throw new Error('Gmail not connected');

  const oauthClient = buildOAuthClientForUser(user);
  const gmail = google.gmail({ version: 'v1', auth: oauthClient });

  const labelId = user.labelIds?.[labelKey];
  if (!labelId) throw new Error(`Invalid label key: "${labelKey}"`);

  // Fetch ALL messages via pagination
  let allMessages = [];
  let pageToken = null;

  do {
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [labelId],
      maxResults: 500,
      ...(pageToken && { pageToken }),
    });
    allMessages = allMessages.concat(response.data.messages || []);
    pageToken = response.data.nextPageToken || null;
  } while (pageToken);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Retry a single trash call with exponential backoff on 429
  const trashWithRetry = async (msgId, retries = 5) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await gmail.users.messages.trash({ userId: 'me', id: msgId });
        return;
      } catch (err) {
        if (err.status === 429 && attempt < retries - 1) {
          const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s, 8s...
          console.log(`429 on ${msgId}, retrying in ${delay}ms`);
          await sleep(delay);
        } else {
          throw err;
        }
      }
    }
  };

  const BATCH_SIZE = 20;
  let deletedCount = 0;

  for (let i = 0; i < allMessages.length; i += BATCH_SIZE) {
    const batch = allMessages.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map((msg) => trashWithRetry(msg.id)));
    deletedCount += batch.length;
    console.log(`Trashed ${deletedCount}/${allMessages.length}`);
    if (i + BATCH_SIZE < allMessages.length) await sleep(1000);
  }

  return { success: true, deletedCount };
};
export default { getAllStats, getRecentEmails };