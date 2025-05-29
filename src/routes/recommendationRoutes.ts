import { Router } from "express";
import { recommendProperty, getReceivedRecommendations } from "../controllers/RecommendationController"
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/recommend", authenticate, recommendProperty);
router.get("/received", authenticate, getReceivedRecommendations);

export default router;
