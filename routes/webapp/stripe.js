
import express from "express";
import { stripeIntent, cancelStripeIntent } from "../../controllers/webapp/stripe.js";

const router = express.Router();

router.post("/create-payment-intent", stripeIntent);
router.post("/cancel-payment-intent", cancelStripeIntent);


export default router;
