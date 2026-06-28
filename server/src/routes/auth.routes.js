import express from "express";
import { signup, login, firebaseAuth } from "../controllers/auth.controller.js";
import { claimUsername } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/firebase", firebaseAuth);
router.put("/username", requireAuth, claimUsername);

export default router;
