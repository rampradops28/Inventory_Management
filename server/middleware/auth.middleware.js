import jwt from "jsonwebtoken";
import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const raw = req.headers.authorization || "";
    const token = raw.startsWith("Bearer ") ? raw.split(" ")[1] : req.cookies?.accessToken;
    if (!token) return next(errorHandler(401, "No token provided"));

    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
      return next(errorHandler(401, "Invalid or expired token"));
    }

    // load fresh user from DB (to get up-to-date role/base/is_active)
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.name, u.role_id, r.name AS role, u.base_id, u.is_active
       FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?`,
      [payload.id]
    );

    if (rows.length === 0 || rows[0].is_active === 0) {
      return next(errorHandler(401, "User not found or inactive"));
    }

    req.user = rows[0]; // {id, email, name, role_id, role, base_id}
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(errorHandler(401, "Unauthorized"));
    if (!allowedRoles.includes(req.user.role)) return next(errorHandler(403, "Access denied"));
    next();
  };
};

// Ensure action is happening within same base (non-Admin)
export const scopeToBase = (extractBaseId) => {
  return (req, res, next) => {
    if (!req.user) return next(errorHandler(401, "Unauthorized"));
    if (req.user.role === "Admin") return next();
    const targetBaseId = Number(extractBaseId(req));
    if (!targetBaseId) return next(errorHandler(400, "Base context required"));
    if (Number(req.user.base_id) !== targetBaseId) return next(errorHandler(403, "Access denied: base mismatch"));
    next();
  };
};
