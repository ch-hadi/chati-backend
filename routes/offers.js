import express from "express";
import {
  getOffersList,
  createNewOffer,
  updateOffer,
  deleteOffer,
  getPaginationList,
  getRestaurantOffers
} from "../controllers/offers.js";
import { verifyUser } from "../controllers/verifyToken.js";
const router = express.Router();

router.get("/offers", getOffersList);
router.get("/offers/listing", getPaginationList);
router.post("/restaurant/offers", getRestaurantOffers);
router.post("/offers", verifyUser, createNewOffer);
router.put("/offers/:id", verifyUser, updateOffer);
router.delete("/offers/:id", verifyUser, deleteOffer);
export default router;
