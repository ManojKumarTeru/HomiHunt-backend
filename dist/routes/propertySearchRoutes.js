"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertySearchController_1 = require("../controllers/propertySearchController");
const router = (0, express_1.Router)();
router.get("/search", propertySearchController_1.searchProperties);
exports.default = router;
