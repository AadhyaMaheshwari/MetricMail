import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createCampaign } from "../controllers/campaignController.js";

const router = express.Router();

// Create a new campaign
router.post("/", protect, createCampaign);

export default router;