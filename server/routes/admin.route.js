import express from "express";
import { getAllUsers } from "../controllers/admin.controller.js";
import { protectedRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, authorizeRoles("Admin"), getAllUsers);

export default router;
