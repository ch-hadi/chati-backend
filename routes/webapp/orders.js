import express from "express";
import { saveOrder, getUserOrderHistory, applyCoupon, removeCoupon } from "../../controllers/webapp/orders.js";
import { verifyUser } from "../../controllers/verifyToken.js";

const router = express.Router();

router.post("/order", saveOrder);
router.post("/order/apply-coupon", applyCoupon);
router.delete("/order/remove-coupon/:id", removeCoupon);
router.get("/order-history/:id?", verifyUser, getUserOrderHistory);


export default router;
