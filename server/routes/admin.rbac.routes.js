import express from "express";
import { listRoleChangeRequestsForAdmin, approveRoleChangeRequest, rejectRoleChangeRequest } from "../controllers/admin.rbac.controller.js";
import { protectedRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/role-change-requests", protectedRoute, authorizeRoles("Admin"), listRoleChangeRequestsForAdmin);
router.post("/role-change-requests/:id/approve", protectedRoute, authorizeRoles("Admin"), approveRoleChangeRequest);
router.post("/role-change-requests/:id/reject", protectedRoute, authorizeRoles("Admin"), rejectRoleChangeRequest);

export default router;
