import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

export const listRoleChangeRequestsForAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = "";
    if (status) { where = "WHERE rcr.status = ?"; params.push(status); }
    const [rows] = await db.query(
      `SELECT rcr.id, rcr.status, rcr.reason, rcr.created_at, rcr.reviewed_at, u.id AS user_id, u.name, u.email, b.name AS base_name, r.name AS requested_role
       FROM role_change_requests rcr
       JOIN users u ON u.id = rcr.user_id
       JOIN bases b ON b.id = u.base_id
       JOIN roles r ON r.id = rcr.requested_role_id
       ${where}
       ORDER BY rcr.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) { next(err); }
};

export const approveRoleChangeRequest = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const id = Number(req.params.id);
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT user_id, requested_role_id, status FROM role_change_requests WHERE id = ? FOR UPDATE", [id]);
    if (!rows.length) { await conn.rollback(); return next(errorHandler(404, "Request not found")); }
    const reqRow = rows[0];
    if (reqRow.status !== "Pending") { await conn.rollback(); return next(errorHandler(400, "Request not pending")); }

    await conn.query("UPDATE users SET role_id = ? WHERE id = ?", [reqRow.requested_role_id, reqRow.user_id]);
    await conn.query("UPDATE role_change_requests SET status='Approved', reviewed_by=?, reviewed_at=NOW() WHERE id = ?", [req.user.id, id]);

    await conn.commit();
    res.json({ message: "Role change approved" });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

export const rejectRoleChangeRequest = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db.query("UPDATE role_change_requests SET status='Rejected', reviewed_by=?, reviewed_at=NOW() WHERE id = ? AND status='Pending'", [req.user.id, id]);
    if (result.affectedRows === 0) return next(errorHandler(400, "Request not pending or not found"));
    res.json({ message: "Role change rejected" });
  } catch (err) { next(err); }
};
