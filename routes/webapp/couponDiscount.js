import express from "express";
import { giveCouponDiscount } from "../../controllers/webapp/couponDiscount.js"
// import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();


router.post("/coupon/discount", giveCouponDiscount);

export default router;
