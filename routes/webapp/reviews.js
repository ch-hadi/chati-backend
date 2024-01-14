import express from 'express';
const router = express.Router();
import {
  getReviewList,
  getPaginationList,
  getReviewApproveList,
  createNewReview,
  updateReview,
  updateBatchReviews,
} from '../../controllers/webapp/reviews.js';
router.get('/review', getReviewList);
router.get('/reviews/listing', getPaginationList);
router.get('/review/approve/:id', getReviewApproveList);
router.post('/review', createNewReview);
router.put('/approve/:id', updateReview);
router.post('/approve-batch', updateBatchReviews);

export default router;
