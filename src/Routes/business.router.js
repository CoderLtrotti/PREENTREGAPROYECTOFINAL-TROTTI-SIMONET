import { Router } from "express";
import { getBusiness, getBusinessById, createBusiness, addProduct } from "../controllers/business.controllers.js";


const router = Router()

router.get("/", getBusiness)
router.post("/", createBusiness)
router.get("/:bid", getBusinessById)
router.post("/:bid/product", addProduct)

export default router