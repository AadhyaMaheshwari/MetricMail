import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";


import {
    createCampaign,
    getCampaigns,
    deleteCampaign,
    uploadRecipients,
    sendCampaign,
    testSendEmail,
    getCampaignAnalytics,
} from "../controllers/campaignController.js";

const router = express.Router();

// Get all campaigns
router.get("/", protect, getCampaigns);

// Create campaign
router.post("/", protect, createCampaign);

// Delete campaign
router.delete("/:id", protect, deleteCampaign);

// Temporary Gmail test endpoint
router.post(
    "/test-send",
    protect,
    testSendEmail
);

// Upload recipients
router.post(
    "/:id/recipients",
    protect,
    upload.single("file"),
    uploadRecipients
);

// Send campaign
router.post(
    "/:id/send",
    protect,
    sendCampaign
);
router.get("/:id/analytics", protect, getCampaignAnalytics);
export default router;