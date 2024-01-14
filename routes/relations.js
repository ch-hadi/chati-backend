import express from "express";
import { resturantWithCards, domainWithCards, resturantAgainstOffer, cardsAgainstResturant } from "../controllers/relations.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();

router.put("/resturant_cards", verifyUser, resturantWithCards);
router.put("/cards_domain", verifyUser, domainWithCards);
router.get("/resturantAgainstOffer/:id", verifyUser, resturantAgainstOffer);
router.get("/resturants/cards/:id", verifyUser, cardsAgainstResturant);

export default router;
