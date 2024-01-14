import express from "express";
import { getCardsWithDomainList, getCardWithDomainDetail, getDomainAssociatedWithCards } from "../../controllers/webapp/cardDomain.js";

const router = express.Router();

router.get("/cardsdomain/list", getCardsWithDomainList);
router.get("/carddomain/detail/:id", getCardWithDomainDetail);
router.get("/domain/cards/:id", getDomainAssociatedWithCards);

export default router;
