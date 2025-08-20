import express from "express";
import { createAssignment, markExpended } from "../controllers/assignments.controller.js";
import { protectedRoute, authorizeRoles, scopeToBase } from "../middleware/auth.middleware.js";
import { audit } from "../middleware/audit.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, authorizeRoles("Admin","BaseCommander"), scopeToBase(req => req.body.base_id), audit("CREATE_ASSIGNMENT","assignments"), createAssignment);
router.post("/:id/expended", protectedRoute, authorizeRoles("Admin","LogisticsOfficer"), audit("MARK_EXPENDED","expenditures"), markExpended);

export default router;
