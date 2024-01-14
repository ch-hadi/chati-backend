import express from "express";
import { getBrandsList, getPaginationList, createNewBrand, updateBrand, deleteBrand } from "../controllers/brands.js";
import { verifyUser } from "../controllers/verifyToken.js";
const router = express.Router();

router.get("/brands", verifyUser, getBrandsList);
router.get("/brands/listing", verifyUser, getPaginationList);
router.post("/brand", verifyUser, createNewBrand);
router.put("/brand/:id", verifyUser, updateBrand);
router.delete("/brand/:id", verifyUser, deleteBrand);
export default router;
