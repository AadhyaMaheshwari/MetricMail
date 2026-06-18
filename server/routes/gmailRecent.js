import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import gmailService from "../services/gmailService.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    const emails = await gmailService.getRecentEmails(user);

    res.json({
      success: true,
      emails,
    });

  }
  catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

export default router;