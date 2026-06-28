import express from "express";
import { saveSubmission, getSubmission, getProfileStats, getPublicProfileStats } from "../controllers/submission.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/submit", requireAuth, saveSubmission);
router.get("/stats/profile", requireAuth, getProfileStats);
router.get("/stats/public/:username", getPublicProfileStats);
router.get("/:problemId", requireAuth, getSubmission);

export default router;
