import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getPropertyById

} from "../controllers/propertyController";
import  {authenticate} from "../middlewares/auth";

const router = Router();

router.post("/create", authenticate, createProperty);
router.get("/", getAllProperties);
router.get("/my-properties", authenticate, getMyProperties);
router.get("/:id",authenticate, getPropertyById);
router.put("/:id", authenticate, updateProperty);
router.delete("/:id", authenticate, deleteProperty);

export default router;
