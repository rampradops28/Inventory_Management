import express from "express";
import { getAllUsers } from "../controllers/admin.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, adminRoute, getAllUsers);

export default router;
