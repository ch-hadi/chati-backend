import express from "express";
import {
    createNewVenue, getVenueList, getFilterlist, updateVenue, deleteVenue, getPaginationList
} from "../controllers/venue.js";
import { verifyUser } from "../controllers/verifyToken.js";

const router = express.Router();

router.get("/venue", verifyUser, getVenueList);
router.get("/venue/listing", verifyUser, getPaginationList);
router.post("/venue", verifyUser, createNewVenue);
router.post("/filter", verifyUser, getFilterlist);
router.delete("/venue/:id", verifyUser, deleteVenue);
router.put("/venue/:id", verifyUser, updateVenue);
export default router;
