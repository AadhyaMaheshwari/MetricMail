import express from 'express';
import protect from '../middleware/authMiddleware.js';
import gmailService from '../services/gmailService.js';

const router = express.Router();

/**
 * GET /api/gmail/stats
 * Returns Gmail label counts (unread, spam, promotions, sent, etc.)
 * for the logged-in user. Requires Gmail to already be connected.
 */
router.get('/stats', protect, async (req, res) => {
  try {
    if (!req.user.gmailConnected) {
      return res.status(200).json({
        success: true,
        gmailConnected: false,
        message: 'Gmail is not connected for this account yet',
        stats: null,
      });
    }

    const stats = await gmailService.getAllStats(req.user);

    res.status(200).json({
      success: true,
      gmailConnected: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching Gmail stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Gmail stats',
      error: error.message,
    });
  }
});

export default router;