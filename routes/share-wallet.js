import express from 'express';
import { verifyUser } from '../controllers/verifyToken.js';
const router = express.Router();
import {
  getSharedWalletReceiver,
  shareWallet,
  getSharedWallet,
  updateUserSharedWalletStatus,
} from '../controllers/share-wallet.js';

router.post('/share-wallet', verifyUser, shareWallet);
router.put(
  '/update-user-sharedWallet-status/:id',
  verifyUser,
  updateUserSharedWalletStatus
);
router.get('/share-wallet', verifyUser, getSharedWallet);
router.get('/share-wallet-receiver', verifyUser, getSharedWalletReceiver);
export default router;
