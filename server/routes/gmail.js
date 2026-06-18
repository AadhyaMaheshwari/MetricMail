import { google } from 'googleapis';

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import gmailService from '../services/gmailService.js';

const router = express.Router();

/**
 * GET /api/gmail/stats
 * Returns Gmail statistics for the currently logged-in user.
 */
router.get('/stats', protect, async (req, res) => {
  try {
    // Find the logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get Gmail statistics
    const stats = await gmailService.getAllStats(user);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching Gmail stats:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch Gmail statistics',
      error: error.message,
    });
  }
});

router.get('/labels', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const oauthClient = gmailService.buildOAuthClientForUser(user);

    const gmail = google.gmail({
      version: 'v1',
      auth: oauthClient,
    });

    const response = await gmail.users.labels.get({
  userId: 'me',
  id: 'INBOX',
});

res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
export default router;