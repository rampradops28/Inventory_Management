import jwt from "jsonwebtoken";
import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

// Middleware to protect routes
export const protectedRoute = async (req, res, next) => {
  try {
    // 1. Get token from headers or cookies
    const raw = req.headers.authorization || "";
    const token = raw.startsWith("Bearer ")
      ? raw.split(" ")[1]
      : req.cookies?.accessToken;

    if (!token) {
      return next(errorHandler(401, "No token provided"));
    }

    // 2. Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return next(errorHandler(401, "Invalid or expired token"));
    }

    // 3. Fetch fresh user from DB
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.name, u.role_id, r.name AS role, u.base_id, u.is_active
       FROM users u 
       JOIN roles r ON r.id = u.role_id 
       WHERE u.id = ?`,
      [payload.id]
    );

    if (rows.length === 0) {
      return next(errorHandler(401, "User not found"));
    }

    if (rows[0].is_active === 0) {
      return next(errorHandler(403, "Account is inactive"));
    }

    // 4. Attach user object to request
    req.user = rows[0]; // {id, email, name, role_id, role, base_id, is_active}
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware for role-based access
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(errorHandler(401, "Unauthorized"));
    if (!allowedRoles.includes(req.user.role)) {
      return next(errorHandler(403, "Access denied"));
    }
    next();
  };
};

// Middleware for base scope restriction
export const scopeToBase = (extractBaseId) => {
  return (req, res, next) => {
    if (!req.user) return next(errorHandler(401, "Unauthorized"));

    // Admins bypass base restriction
    if (req.user.role === "Admin") return next();

    const targetBaseId = Number(extractBaseId(req));
    if (!targetBaseId) return next(errorHandler(400, "Base context required"));

    if (Number(req.user.base_id) !== targetBaseId) {
      return next(errorHandler(403, "Access denied: base mismatch"));
    }
    next();
  };
};
