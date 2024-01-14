import express from "express";
import {
  getDomainsList,
  createNewDomains,
  updateDomains,
  deleteDomains,
  getPaginationList,
} from "../controllers/domains.js";
import { verifyUser } from "../controllers/verifyToken.js";
const router = express.Router();

router.get("/domains", verifyUser, getDomainsList);
router.get("/domains/listing", verifyUser, getPaginationList);
router.post("/domains", verifyUser, createNewDomains);
router.put("/domains/:id", verifyUser, updateDomains);
router.delete("/domains/:id", verifyUser, deleteDomains);
export default router;
