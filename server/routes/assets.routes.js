import express from "express";
import { createAsset, listAssets, getAssetStock } from "../controllers/assets.controller.js";
import { protectedRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { audit } from "../middleware/audit.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, authorizeRoles("Admin","LogisticsOfficer"), audit("CREATE_ASSET","assets"), createAsset);
router.get("/", protectedRoute, listAssets);
router.get("/:id/stock", protectedRoute, getAssetStock);

export default router;
