import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, addFavorite);
router.get("/", authenticate, getFavorites);
router.delete("/:propertyId", authenticate, removeFavorite);

export default router;
