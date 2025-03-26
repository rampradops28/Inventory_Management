import express from "express";
import {
  createReservations,
  deleteReservation,
  getUserReservations,
  getBorrowHistory,
  getUserBorrowHistory,
  markAsBorrowed,
  getAllReservations,
  markAsCompleted,
  getBorrowedBooks,
} from "../controllers/reservation.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// member
router.post("/", protectedRoute, createReservations);
router.get("/", protectedRoute, getUserReservations);
router.delete("/:reservation_id", protectedRoute, deleteReservation);
router.get("/history", protectedRoute, getBorrowHistory);

//admin
router.get(
  "/history/:user_id",
  protectedRoute,
  adminRoute,
  getUserBorrowHistory
);
router.put("/:reservation_id", protectedRoute, adminRoute, markAsBorrowed);
router.get("/all", protectedRoute, adminRoute, getAllReservations);
router.put(
  "/completed/:reservation_id",
  protectedRoute,
  adminRoute,
  markAsCompleted
);
router.get("/borrowed", protectedRoute, adminRoute, getBorrowedBooks);

export default router;
