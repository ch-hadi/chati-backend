import express from 'express';
import { getDeliveryList } from '../controllers/delivery.js';
import { verifyUser } from '../controllers/verifyToken.js';

const router = express.Router();

router.get('/delivery/list', verifyUser, getDeliveryList);
export default router;
