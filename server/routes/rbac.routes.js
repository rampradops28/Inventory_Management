import express from "express";
import { createRoleChangeRequest, listMyRoleChangeRequests } from "../controllers/rbac.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/role-change-requests", protectedRoute, createRoleChangeRequest);
router.get("/role-change-requests/mine", protectedRoute, listMyRoleChangeRequests);

export default router;
