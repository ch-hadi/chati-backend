import express from 'express';
const router = express.Router();
import {
  getCustomPageList,
  getPaginationList,
  createCustomPage,
  updateCustomPage,
  deleteCustomPage,
  getCustomPage,getAllDetailsOnCardIdLikeOffersLocationsResturants
} from '../../controllers/webapp/custom_page.js';
router.get('/custom-page', getCustomPageList);
router.get('/custom-page/listing', getPaginationList);
router.post('/custom-page', createCustomPage);
router.put('/custom-page/:id', updateCustomPage);
router.get('/custom-page/:id', getCustomPage);
router.delete('/custom-page/:id',deleteCustomPage);
router.get('/details/:id',getAllDetailsOnCardIdLikeOffersLocationsResturants)

export default router;
