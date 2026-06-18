import { google } from 'googleapis';
import User from '../models/User.js';

// Labels we want counts for. Key = friendly name used in the API response,
// value = the actual Gmail label ID.
const LABELS = {
  unread: 'UNREAD',
  spam: 'SPAM',
  promotions: 'CATEGORY_PROMOTIONS',
  sent: 'SENT',
  inbox: 'INBOX',
  social: 'CATEGORY_SOCIAL',
};

/**
 * Builds an authenticated Gmail API client for a given user, using their
 * stored tokens. Automatically refreshes the access token if it has
 * expired, and saves the new one back to MongoDB.
 */
function buildOAuthClientForUser(user) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
    // no redirect URI needed here — we're not starting a new auth flow,
    // just using existing tokens
  );

  client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  // If Google issues a new access token during this request (because the
  // old one expired), persist it so we don't have to re-fetch it next time.
  client.on('tokens', async (newTokens) => {
    try {
      if (newTokens.access_token) {
        user.googleAccessToken = newTokens.access_token;
      }
      if (newTokens.refresh_token) {
        user.googleRefreshToken = newTokens.refresh_token;
      }
      await user.save();
    } catch (err) {
      console.error('Failed to persist refreshed Google tokens:', err.message);
    }
  });

  return client;
}

/**
 * Returns the exact message count for a single Gmail label.
 *
 * NOTE: resultSizeEstimate from messages.list is unreliable, especially
 * with a low maxResults — it was observed returning the same incorrect
 * number across different labelIds. Paginating through messages.list
 * works around that, but costs one round trip (5 quota units) per 500
 * messages, per label — expensive for labels like Promotions or Updates
 * that can hold thousands of messages.
 *
 * labels.get returns the same count Gmail's own UI shows, in one call
 * that costs 1 quota unit, with no pagination needed.
 */
async function getLabelCount(gmail, labelId) {
  const response = await gmail.users.labels.get({
    userId: 'me',
    id: labelId,
  });

  return response.data.messagesTotal || 0;
}

/**
 * Fetches counts for every label in LABELS for the given user.
 * Returns a plain object like:
 * { unread: 12, spam: 3, promotions: 40, sent: 8, inbox: 55, ... }
 */
async function getAllStats(user) {
  if (!user.gmailConnected) {
    throw new Error('Gmail is not connected for this user');
  }

  const oauthClient = buildOAuthClientForUser(user);
  const gmail = google.gmail({ version: 'v1', auth: oauthClient });

  const labelEntries = Object.entries(LABELS);

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

  const gmail = google.gmail({
    version: "v1",
    auth: oauthClient,
  });

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  const messages = response.data.messages || [];

  const emails = await Promise.all(
    messages.map(async (message) => {

      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const headers = email.data.payload.headers;

      return {
        from:
          headers.find(h => h.name === "From")?.value || "",

        subject:
          headers.find(h => h.name === "Subject")?.value || "",
      };
    })
  );

  return emails;
}
export default {
  getAllStats,
  getRecentEmails,
};