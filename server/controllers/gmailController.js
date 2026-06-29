import { trashEmailsService } from '../services/gmailService.js';
import User from '../models/User.js';

// ADD THIS:
console.log("trashEmailsService type:", typeof trashEmailsService);


export const trashEmails = async (req, res) => {
  try {
    const { labelKey } = req.body;
    const user = await User.findById(req.user.id);

    // ADD THIS:
    console.log("labelKey:", labelKey);
    console.log("user.labelIds:", user.labelIds);
    console.log("user.gmailConnected:", user.gmailConnected);

    const result = await trashEmailsService(user, labelKey);
    res.json(result);
  } catch (err) {
    console.error("❌ BACKEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};