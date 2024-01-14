import express from "express";
import { getPaginationList, getCouponsList, createNewCoupons, deleteCoupon, getCoupons_Products_Id, updateCoupon, getCouponDetails } from "../controllers/coupons.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();
router.get("/coupons/listing", verifyUser, getPaginationList);
router.get("/coupons/list", verifyUser, getCouponsList);
router.get("/coupons/products", verifyUser, getCoupons_Products_Id);
router.post("/coupons", verifyUser, createNewCoupons);
router.get("/coupons/:id", verifyUser, getCouponDetails);
router.put("/coupons/:id", verifyUser, updateCoupon);
router.delete("/coupons/:id", verifyUser, deleteCoupon);
export default router;
