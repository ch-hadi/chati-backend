import express from "express";
import { getPaginationList, getSalesPeopleCity, getSalesPeopleList, createNewSalesPeople, updateSalePeople, deleteSalePeople } from "../controllers/salesPerson.js";
import { verifyUser } from "../controllers/verifyToken.js";
const router = express.Router();

router.get("/sales/people", verifyUser, getSalesPeopleList);
router.get("/sales/city", verifyUser, getSalesPeopleCity);
router.get("/sales/people/listing", verifyUser, getPaginationList);
router.post("/saleperson", verifyUser, createNewSalesPeople);
router.put("/saleperson/:id", verifyUser, updateSalePeople);
router.delete("/saleperson/:id", verifyUser, deleteSalePeople);
export default router;
