import express from "express";
import { createPurchase, listPurchases } from "../controllers/purchases.controller.js";
import { protectedRoute, authorizeRoles, scopeToBase } from "../middleware/auth.middleware.js";
import { audit } from "../middleware/audit.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, authorizeRoles("Admin","LogisticsOfficer"), scopeToBase(req => req.body.base_id), audit("CREATE_PURCHASE","purchases"), createPurchase);
router.get("/", protectedRoute, listPurchases);

export default router;
