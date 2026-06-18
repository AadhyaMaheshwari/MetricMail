import express from 'express';
import { google } from 'googleapis';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

let oauth2Client = null;

function getOAuth2Client() {
  if (!oauth2Client) {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_CONNECT_REDIRECT_URI
    ) {
      throw new Error(
        'Missing Google OAuth environment variables for Connect Gmail flow'
      );
    }

    oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CONNECT_REDIRECT_URI
    );
  }

  return oauth2Client;
}

const SCOPES = [
  'email',
  'https://www.googleapis.com/auth/gmail.readonly',
];

/**
 * GET /api/auth/google/connect
 * User must already be logged in.
 */
router.get('/google/connect', protect, (req, res) => {
  try {
    const client = getOAuth2Client();

    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
      state: req.user._id.toString(),
    });

    console.log('Generated Connect Gmail auth URL:', authUrl);

    res.json({
  success: true,
  authUrl,
});
  } catch (error) {
    console.error('Error generating Connect Gmail authorization URL:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to generate authorization URL',
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/google/connect/callback
 */
router.get('/google/connect/callback', async (req, res) => {
  console.log('===== CONNECT CALLBACK HIT =====');
  console.log('Query params:', req.query);

  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is missing from callback',
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message:
          'Missing state parameter — cannot identify which user to connect',
      });
    }

    const client = getOAuth2Client();

    const { tokens } = await client.getToken(code);

    client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();

    const googleEmail = userInfo.data.email;

    if (!googleEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google',
      });
    }

    // state contains logged-in user's MongoDB id
    const user = await User.findById(state);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Logged-in user not found',
      });
    }

    console.log('App account email:', user.email);
    console.log('Selected Google email:', googleEmail);

    // Email mismatch check
    if (user.email.toLowerCase() !== googleEmail.toLowerCase()) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

      return res.redirect(`${clientUrl}/dashboard?gmailError=mismatch`);
    }

    // Save Gmail tokens
    user.googleId = userInfo.data.id;
    user.googleAccessToken = tokens.access_token;

    if (tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token;
    }

    user.gmailConnected = true;

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    res.redirect(`${clientUrl}/dashboard?gmailConnected=true`);
  } catch (error) {
    console.error('Error during Connect Gmail callback:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to connect Gmail',
      error: error.message,
    });
  }
});

export default router;