// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import db from "../lib/db.js";

// members fucntions start
export const createReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { book_id } = req.body;

    if (!userId || !book_id) {
      return next(errorHandler(400, "User ID and Book ID are required"));
    }

    const existingReservation = await db.query(
      "SELECT * FROM reservations WHERE user_id = ? AND book_id = ? AND status IN ('pending', 'borrowed')",
      [userId, book_id]
    );

    if (existingReservation[0].length > 0) {
      return next(
        errorHandler(400, "You already have a reservation for this book")
      );
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
      message: "Reservation created successfully",
      reservation: createdReservation[0],
    });
  } catch (error) {
    console.log("Error creating reservation:", error);
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
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting reservation:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// pending and borrowed reservations with borrowed date
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
    console.log("Error fetching user reservations:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// user borrow history with return date and fine (is there any)
export const getBorrowHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return next(errorHandler(400, "User ID is required"));
    }

    const query = `
    SELECT bh.id AS borrow_id, b.id AS book_id, b.title, bh.borrowed_date, bh.returned_date, bh.fine
    FROM borrow_history bh
    JOIN books b ON bh.book_id = b.id
    WHERE bh.user_id = ?
    ORDER BY bh.borrowed_date DESC
  `;

    const [results] = await db.query(query, [userId]);

    res.status(200).json({
      borrowHistory: results,
    });
  } catch (error) {
    console.log("Error fetching user borrow history:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
// members functions end

// admin functions

// get specific user borrow history
export const getUserBorrowHistory = async (req, res, next) => {
  try {
    const { user_id } = req.params; // Get user ID from request params

    if (!user_id) {
      return next(errorHandler(400, "User ID is required"));
    }

    const query = `
      SELECT 
        bh.id AS borrow_id, 
        b.id AS book_id, 
        b.title, 
        bh.borrowed_date, 
        bh.returned_date, 
        IFNULL(bh.fine, 0) AS fine
      FROM borrow_history bh
      JOIN books b ON bh.book_id = b.id
      WHERE bh.user_id = ?
      ORDER BY bh.borrowed_date DESC
    `;

    const [results] = await db.execute(query, [user_id]);
    res.status(200).json({ borrowedBooks: results });
  } catch (error) {
    console.log("Error fetching user borrow history:", error);
    next(errorHandler(500, "Database Error"));
  }
};

// admin mark reservation as borrowed
export const markAsBorrowed = async (req, res, next) => {
  try {
    const { reservation_id } = req.params;

    if (!reservation_id) {
      return next(errorHandler(400, "Reservation ID is required"));
    }

    const [reservation] = await db.execute(
      "SELECT status FROM reservations WHERE id = ?",
      [reservation_id]
    );

    if (reservation.length === 0) {
      return next(errorHandler(404, "Reservation not found"));
    }

    if (reservation[0].status === "borrowed") {
      return next(
        errorHandler(400, "Reservation is already marked as borrowed")
      );
    }

    // Update status to 'borrowed'
    const updateQuery = `
      UPDATE reservations 
      SET status = 'borrowed' 
      WHERE id = ?
    `;
    const [updateResult] = await db.execute(updateQuery, [reservation_id]);

    if (updateResult.affectedRows === 0) {
      return next(errorHandler(404, "Reservation not found"));
    }

    // Insert into borrow history
    const insertQuery = `
      INSERT INTO borrow_history (user_id, book_id, borrowed_date) 
      SELECT user_id, book_id, CURDATE() 
      FROM reservations 
      WHERE id = ?
    `;
    await db.execute(insertQuery, [reservation_id]);

    const selectQuery = `
      SELECT 
        bh.id AS borrow_id, 
        b.id AS book_id, 
        b.title, 
        bh.borrowed_date, 
        bh.returned_date, 
        IFNULL(bh.fine, 0) AS fine
      FROM borrow_history bh
      JOIN books b ON bh.book_id = b.id
      WHERE bh.user_id = (SELECT user_id FROM reservations WHERE id = ?)
        AND bh.book_id = (SELECT book_id FROM reservations WHERE id = ?)
      ORDER BY bh.borrowed_date DESC
      LIMIT 1
    `;
    const [borrowedBook] = await db.execute(selectQuery, [
      reservation_id,
      reservation_id,
    ]);

    res.status(200).json({
      message: "Reservation marked as borrowed successfully",
      borrowedBook: borrowedBook[0],
    });
  } catch (error) {
    console.log("Error marking reservation as borrowed:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// get all reservations
export const getAllReservations = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        r.id AS reservation_id, 
        u.id AS user_id, 
        u.name AS user_name, 
        u.email, 
        b.id AS book_id, 
        b.title AS book_title, 
        r.reservation_date, 
        r.status,
        bh.borrowed_date, 
        bh.returned_date,
        IFNULL(bh.fine, 0) AS fine
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN books b ON r.book_id = b.id
      LEFT JOIN borrow_history bh ON r.user_id = bh.user_id AND r.book_id = bh.book_id
      ORDER BY r.reservation_date DESC
    `;

    const [results] = await db.execute(query);

    res.status(200).json({
      reservations: results,
    });
  } catch (error) {
    console.log("Error fetching reservations:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// make a reservation as completed
export const markAsCompleted = async (req, res, next) => {
  try {
    const { reservation_id } = req.params;

    if (!reservation_id) {
      return next(errorHandler(400, "Reservation ID is required"));
    }

    const [reservation] = await db.execute(
      "SELECT status FROM reservations WHERE id = ?",
      [reservation_id]
    );

    if (reservation.length === 0) {
      return next(errorHandler(404, "Reservation not found"));
    }

    const currentStatus = reservation[0].status;

    if (currentStatus === "completed") {
      return next(
        errorHandler(400, "Reservation is already marked as completed")
      );
    }

    if (currentStatus === "pending") {
      return next(
        errorHandler(
          400,
          "Reservation must be marked as borrowed before completing"
        )
      );
    }

    // Update reservation status to 'completed'
    const updateReservationQuery = `
      UPDATE reservations 
      SET status = 'completed' 
      WHERE id = ?;
    `;
    const [reservationResult] = await db.execute(updateReservationQuery, [
      reservation_id,
    ]);

    if (reservationResult.affectedRows === 0) {
      return next(errorHandler(404, "Reservation not found"));
    }

    // Update borrow history and set returned date and calculate fine if overdue
    const updateBorrowHistoryQuery = `
      UPDATE borrow_history 
      SET returned_date = CURDATE(), 
          fine = GREATEST(0, (DATEDIFF(CURDATE(), borrowed_date) - 7) * 20)
      WHERE book_id = (SELECT book_id FROM reservations WHERE id = ?)
        AND user_id = (SELECT user_id FROM reservations WHERE id = ?)
        AND returned_date IS NULL;
    `;
    await db.execute(updateBorrowHistoryQuery, [
      reservation_id,
      reservation_id,
    ]);

    // Fetch updated reservation details
    const getUpdatedReservationQuery = `
      SELECT 
        r.id AS reservation_id, 
        u.id AS user_id, 
        u.name AS user_name, 
        u.email, 
        b.id AS book_id, 
        b.title AS book_title, 
        r.reservation_date, 
        r.status,
        bh.borrowed_date, 
        bh.returned_date,
        IFNULL(bh.fine, 0) AS fine
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN books b ON r.book_id = b.id
      LEFT JOIN borrow_history bh ON r.user_id = bh.user_id AND r.book_id = bh.book_id
      WHERE r.id = ?;
    `;
    const [updatedReservation] = await db.execute(getUpdatedReservationQuery, [
      reservation_id,
    ]);

    res.status(200).json({
      reservation: updatedReservation[0],
    });
  } catch (error) {
    console.log("Error marking reservation as completed:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// get all borrowed books
export const getBorrowedBooks = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        bh.id AS borrow_id, 
        u.id AS user_id, 
        u.name AS user_name, 
        u.email, 
        u.contact, 
        b.id AS book_id, 
        b.title, 
        bh.borrowed_date
      FROM borrow_history bh
      JOIN users u ON bh.user_id = u.id
      JOIN books b ON bh.book_id = b.id
      WHERE bh.returned_date IS NULL
      ORDER BY bh.borrowed_date ASC
    `;

    const [results] = await db.execute(query);

    res.status(200).json({
      borrowedBooks: results,
    });
  } catch (error) {
    console.log("Error fetching borrowed books:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// admin functions end
