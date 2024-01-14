import express from "express";
import {
    getPaymentCards,
    createPaymentCard,
    updatePaymentCard,
    deletePaymentCard
} from "../../controllers/webapp/paymentCard.js";
import { verifyUser } from "../../controllers/verifyToken.js";

const router = express.Router();

router.get("/payment-card", verifyUser, getPaymentCards);
router.post("/payment-card", verifyUser, createPaymentCard);
router.put("/payment-card/:id", verifyUser, updatePaymentCard);
router.delete("/payment-card/:id", verifyUser, deletePaymentCard);


export default router;
