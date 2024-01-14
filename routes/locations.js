import express from 'express';
import {
  createNewLocation,
  getLocationsList,
  getFilterlist,
  updateLocation,
  deleteLocation,
  getPaginationList,
} from '../controllers/locations.js';
import { verifyUser } from '../controllers/verifyToken.js';

const router = express.Router();

router.get('/locations', getLocationsList);
router.get('/locations/listing', getPaginationList);
router.post('/locations', verifyUser, createNewLocation);
router.get('/locations/filter', getFilterlist);
router.delete('/locations/:id', verifyUser, deleteLocation);
router.put('/locations/:id', verifyUser, updateLocation);
export default router;
