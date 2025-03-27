import express from "express";
import {
  register,
  verifyEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  googleOAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", register);
router.post("/google-oauth", googleOAuth);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forget-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/profile", protectedRoute, getProfile);
router.patch("/profile-update", protectedRoute, updateProfile);

export default router;
