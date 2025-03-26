import express from "express";
import {
  createReservations,
  deleteReservation,
  getUserReservations,
} from "../controllers/reservation.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createReservations);
router.get("/", protectedRoute, getUserReservations);
router.delete("/:reservation_id", protectedRoute, deleteReservation);

export default router;
