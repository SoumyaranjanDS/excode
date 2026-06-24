import express from "express";
import { generateProblemDetails, saveProblem } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", requireAuth, generateProblemDetails);
router.post("/problems", requireAuth, saveProblem);

export default router;
