import express from "express";
import { totalRecords, ratingPointsOnCards, getUsersAndResturantsWithLatLng } from "../controllers/dashboard.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();

router.get("/dashboard", verifyUser, totalRecords);
router.get("/dashboard/ratings", verifyUser, ratingPointsOnCards);
router.get("/dashboard/users-resturants/locations", verifyUser, getUsersAndResturantsWithLatLng);
export default router;
