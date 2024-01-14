import express from "express";
import appAnalytics from "../controllers/firebase-analytics.js";
const router = express.Router();

router.get("/analytics", appAnalytics);
export default router