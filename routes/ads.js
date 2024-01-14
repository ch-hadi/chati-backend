import express from 'express';
import {
  getAdsList,
  createNewAd,
  deleteAd,
  updateAd,
  getPaginationList,
  countAdClicks,
  countAdImpression,
} from '../controllers/ads.js';
import { verifyUser } from '../controllers/verifyToken.js';

const router = express.Router();

router.get('/ads', verifyUser, getAdsList);
router.get('/ads/listing', verifyUser, getPaginationList);
router.post('/ads', verifyUser, createNewAd);
router.delete('/ads/:id', verifyUser, deleteAd);
router.put('/ads/clicks-count/:id', verifyUser, countAdClicks);
router.put('/ads/impressions-count/:id', verifyUser, countAdImpression);
router.put('/ads/:id', verifyUser, updateAd);
export default router;
