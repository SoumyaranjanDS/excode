import express from "express";
import { evaluateCode } from "../controllers/evaluation.controller.js";

const router = express.Router();

router.post("/", evaluateCode);

export default router;
