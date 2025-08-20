import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", protectedRoute, getDashboard);
export default router;
