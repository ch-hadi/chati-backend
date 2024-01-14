import express from 'express';
import {
  getResturentList,
  createNewResturent,
  updateResturant,
  deleteResturant,
  getPaginationList,
  uploadResturantMenu,
  getSingleResturent,
} from '../controllers/resturent.js';
import { verifyUser } from '../controllers/verifyToken.js';
const router = express.Router();

router.get('/resturent', getResturentList);
router.get('/resturent/:id', getSingleResturent);
router.get('/all-resturent/', getPaginationList);
router.post('/resturent', verifyUser, createNewResturent);
router.put('/resturent/:id', verifyUser, updateResturant);
router.delete('/resturent/:id', verifyUser, deleteResturant);
router.post('/resturent/upload-menu', verifyUser, uploadResturantMenu);
export default router;
