import { Router } from "express";
import {searchProperties  } from "../controllers/propertySearchController";

const router = Router();

router.get("/search", searchProperties);

export default router;