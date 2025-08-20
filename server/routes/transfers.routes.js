import express from "express";
import { createTransfer, approveTransfer, listTransfers } from "../controllers/transfers.controller.js";
import { protectedRoute, authorizeRoles, scopeToBase } from "../middleware/auth.middleware.js";
import { audit } from "../middleware/audit.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, authorizeRoles("Admin","LogisticsOfficer"), scopeToBase(req => req.body.from_base_id), audit("CREATE_TRANSFER","transfers"), createTransfer);
router.post("/:id/approve", protectedRoute, authorizeRoles("Admin"), audit("APPROVE_TRANSFER","transfers"), approveTransfer);
router.get("/", protectedRoute, listTransfers);

export default router;
