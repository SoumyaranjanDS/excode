import express from "express";
import { generateProblemDetails, saveProblem, getAllProblemsAdmin, updateProblem, deleteProblem } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", requireAuth, generateProblemDetails);
router.post("/problems", requireAuth, saveProblem);
router.get("/problems", requireAuth, getAllProblemsAdmin);
router.put("/problems/:id", requireAuth, updateProblem);
router.delete("/problems/:id", requireAuth, deleteProblem);

export default router;
