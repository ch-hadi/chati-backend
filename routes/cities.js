import express from "express";
import { getCitiesList, getPaginationList, createNewCities, updateCity, deleteCity } from "../controllers/cities.js";
import { verifyUser } from "../controllers/verifyToken.js";
const router = express.Router();

router.get("/cities", getCitiesList);
router.get("/cities/listing", getPaginationList);
router.post("/city", verifyUser, createNewCities);
router.put("/city/:id", verifyUser, updateCity);
router.delete("/city/:id", verifyUser, deleteCity);
export default router;
