import express from "express";
import { firebaseNotification, getNotificationList, createNewNotification, deleteNotification, updateNotification, getPaginationList } from "../controllers/notification.js";
import { verifyUser } from "../controllers/verifyToken.js";
const router = express.Router();

router.post("/firebase/notification", verifyUser, firebaseNotification);
router.get("/list/notification", verifyUser, getNotificationList);
router.get("/listing/notification", verifyUser, getPaginationList);
router.post("/notification", verifyUser, createNewNotification);
router.put("/notification/:id", verifyUser, updateNotification);
router.delete("/notification/:id", verifyUser, deleteNotification);
export default router;
