// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import db from "../lib/db.js";

export const createReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { book_id } = req.body;

    if (!userId || !book_id) {
      return next(errorHandler(400, "User ID and Book ID are required"));
    }

    const query = `
          INSERT INTO reservations (user_id, book_id, reservation_date, status) 
          VALUES (?, ?, CURDATE(), 'pending')
        `;

    const [result] = await db.execute(query, [userId, book_id]);

    const [createdReservation] = await db.query(
      "SELECT * FROM reservations WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      reservation: createdReservation[0],
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reservation_id } = req.params;

    if (!reservation_id) {
      return next(errorHandler(400, "Reservation ID is required"));
    }

    const [reservation] = await db.execute(
      "SELECT * FROM reservations WHERE id = ?",
      [reservation_id]
    );

    if (reservation.length === 0) {
      return next(errorHandler(404, "Reservation not found"));
    }

    if (reservation[0].user_id !== userId) {
      return next(
        errorHandler(403, "You are not authorized to delete this reservation")
      );
    }

    const [result] = await db.execute("DELETE FROM reservations WHERE id = ?", [
      reservation_id,
    ]);

    if (result.affectedRows === 0) {
      return next(errorHandler(404, "Reservation not found"));
    }

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getUserReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return next(errorHandler(400, "User ID is required"));
    }

    const query = `
        SELECT 
          r.id AS reservation_id, 
          b.id AS book_id, 
          b.title, 
          r.reservation_date, 
          r.status,
          bh.borrowed_date, 
          bh.returned_date,
          IFNULL(bh.fine, 0) AS fine
        FROM reservations r
        JOIN books b ON r.book_id = b.id
        LEFT JOIN borrow_history bh ON r.user_id = bh.user_id AND r.book_id = bh.book_id
        WHERE r.user_id = ? AND r.status IN ('pending', 'borrowed')
        ORDER BY r.reservation_date DESC
      `;

    const [results] = await db.execute(query, [userId]);

    res.status(200).json({
      reservations: results,
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
