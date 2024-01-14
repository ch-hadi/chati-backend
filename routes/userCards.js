import express from "express";
import {
  getPaginationList,
  getUserCards,
  updateUserCard,deActiveUserCard
} from "../controllers/userCards.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();

router.get("/user-cards", verifyUser, getPaginationList);
router.get("/registered/user-cards/:id?", verifyUser, getUserCards);
router.put("/update/user-card", verifyUser, updateUserCard);
router.put("/deactive/:id", verifyUser, deActiveUserCard);

export default router;
