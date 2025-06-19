"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendationController_1 = require("../controllers/recommendationController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/recommend", auth_1.authenticate, recommendationController_1.recommendProperty);
router.get("/received", auth_1.authenticate, recommendationController_1.getReceivedRecommendations);
exports.default = router;
