import express from 'express';
import { createNewRedeem, getPaginationList } from '../controllers/redeem.js';
import { verifyUser } from '../controllers/verifyToken.js';
const router = express.Router();

router.get('/redeem/listing', verifyUser, getPaginationList);
router.post('/redeem', verifyUser, createNewRedeem);
// router.put('/resturent/:id', verifyUser, updateResturant);
export default router;
