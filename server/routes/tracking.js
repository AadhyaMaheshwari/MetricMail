import express from "express";
import { trackOpen } from "../controllers/trackingController.js";

const router = express.Router();

router.get("/open/:token", trackOpen);

export default router;