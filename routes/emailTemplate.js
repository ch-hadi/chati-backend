import express from "express";
import { getTemplates,getAllTemplates } from "../controllers/emailTemplate.js";
const router = express.Router();

router.get('/email-template/',getAllTemplates);
router.get('/email-template/:id',getTemplates);
export default router;