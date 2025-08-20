import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createRoleChangeRequest = async (req, res, next) => {
  try {
    if (req.user.role !== "BaseCommander") return next(errorHandler(403, "Only Base Commanders can request upgrade"));

    // Only allow requesting LogisticsOfficer (role_id = 3)
    const [pending] = await db.query("SELECT id FROM role_change_requests WHERE user_id=? AND status='Pending'", [req.user.id]);
    if (pending.length) return next(errorHandler(400, "You already have a pending request"));

    await db.query("INSERT INTO role_change_requests (user_id, requested_role_id, status) VALUES (?, ?, 'Pending')", [req.user.id, 3]);
    return res.status(201).json({ message: "Role change request created" });
  } catch (err) { next(err); }
};

export const listMyRoleChangeRequests = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT id, requested_role_id, status, reason, created_at, reviewed_at FROM role_change_requests WHERE user_id=? ORDER BY created_at DESC", [req.user.id]);
    return res.json(rows);
  } catch (err) { next(err); }
};
