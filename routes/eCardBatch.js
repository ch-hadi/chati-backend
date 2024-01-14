import express from "express";
import {
  getPaginatedList,
  generateBulkEcards,
  getBatchData
} from "../controllers/eCardBatch.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();

router.get("/ecard-batch", verifyUser, getPaginatedList);
router.post("/ecard-batch/generate", verifyUser, generateBulkEcards);
router.get("/ecard-batch/:id", verifyUser, getBatchData);

export default router;
