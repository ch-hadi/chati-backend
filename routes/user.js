import express from 'express';
import {
  getUsersList,
  getUser,
  deleteUser,
  register,
  updateUser,
  updateUserFromCheckout,
  adminLogin,
  userLogin,
  forgetPassword,
  searchUserRecord,
  getPaginationList,
  checkUserFromCheckout,
  changePassword,
  getLoginHistory,
  forgetPasswordAndEmailToUser,
  resetPassword
} from '../controllers/user.js';
import { verifyUser } from '../controllers/verifyToken.js';
const router = express.Router();
router.get('/users',  getUsersList);
router.get('/users/login-history/listing', verifyUser, getLoginHistory);
router.get('/user/:id', verifyUser, getUser);
router.get('/users/listing', verifyUser, getPaginationList);
router.delete('/user/:id', verifyUser, deleteUser);
router.post('/register', register);
router.put('/updateUser/:id', verifyUser, updateUser);
router.post('/check-user/checkout', checkUserFromCheckout);
router.put('/updateUser/checkout/:id', verifyUser, updateUserFromCheckout);
router.post('/login', adminLogin);
router.post('/user/login', userLogin);
router.post('/forget/password', verifyUser, forgetPassword);
router.post('/reset/password', forgetPasswordAndEmailToUser);
router.post('/reset-password', resetPassword);
router.post('/change/password', verifyUser, changePassword);
router.post('/searchUserRecord', verifyUser, searchUserRecord);


export default router;
