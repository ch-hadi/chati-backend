import express from 'express';
import {
  getCardsList,
  createNewCard,
  deleteCard,
  updateCard,
  getPaginationList,
  getCardsListByDomainId,
  getCardByECardNumber,
  assignCard,
  assignCardsToUsers,
  createCustomUserCard,
} from '../controllers/cards.js';
import { verifyUser } from '../controllers/verifyToken.js';

const router = express.Router();

router.get('/cards/list', getCardsList);
router.get('/cards/listing', verifyUser, getPaginationList);
router.get('/card-details/:cardNo', verifyUser, getCardByECardNumber);
router.post('/cards', verifyUser, createNewCard);
router.post('/assign-card', verifyUser, assignCard);
router.delete('/cards/:id', verifyUser, deleteCard);
router.post('/cards/domain', getCardsListByDomainId);
router.post('/cards/assign-to-user/', assignCardsToUsers);
router.put('/cards/:id', verifyUser, updateCard);
router.post('/cards/create-custom-card', verifyUser, createCustomUserCard);
export default router;
