import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import dotenv from "dotenv";
import db from "../lib/db.js";

dotenv.config();

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return next(errorHandler(401, "Unauthorized - No Access Token Provided"));
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const [results] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [decoded.user_id]
      );

      if (results.length === 0) {
        return next(errorHandler(404, "User not found"));
      }

      req.user = results[0];
      console.log("req.user:", req.user);
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(errorHandler(401, "Unauthorized - Token Expired"));
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in protectedRoute:", error);
    return next(errorHandler(401, "Invalid Access Token"));
  }
};

export const adminRoute = (req, res, next) => {
  console.log("User:", req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(errorHandler(401, "Unauthorized - Not an Admin"));
  }
};
