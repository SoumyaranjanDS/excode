import express from "express";
import { signup, login, firebaseAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/firebase", firebaseAuth);

export default router;
