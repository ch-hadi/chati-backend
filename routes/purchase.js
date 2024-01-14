import express from "express";
import { getPurchaseList, createNewPurchase, getFilterlist, updatePurchase, deletePurchase, getPaginationList } from "../controllers/purchase.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();


router.get("/purchase/listing", verifyUser, getPaginationList);
router.get("/purchase/list", verifyUser, getPurchaseList);
router.post("/purchase", verifyUser, createNewPurchase);
router.post("/purchase/filter", verifyUser, getFilterlist);
router.delete("/purchase/:id", verifyUser, deletePurchase);
router.put("/purchase/:id", verifyUser, updatePurchase);
export default router;
