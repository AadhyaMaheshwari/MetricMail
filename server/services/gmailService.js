import { google } from 'googleapis';
import User from '../models/User.js';
import fs from "fs";

// value = the actual Gmail label ID.
const LABELS = {
  unread: 'UNREAD',
  spam: 'SPAM',
  promotions: 'CATEGORY_PROMOTIONS',
  sent: 'SENT',
  inbox: 'INBOX',
  social: 'CATEGORY_SOCIAL',
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


async function getLabelCount(gmail, labelId) {
  const response = await gmail.users.labels.get({
    userId: 'me',
    id: labelId,
  });

  return response.data.messagesTotal || 0;
}

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