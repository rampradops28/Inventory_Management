import db from "../lib/db.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, r.name AS role, b.name AS base, u.created_at, u.is_verified, u.is_active
       FROM users u JOIN roles r ON r.id = u.role_id JOIN bases b ON b.id = u.base_id
       ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
};
