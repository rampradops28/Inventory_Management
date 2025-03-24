import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return next(errorHandler(401, "UnAuthorized - No Access Token Provided"));
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decoded.user_id).select("-password");

      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(errorHandler(401, "UnAuthorized - Token Expired"));
      }

      throw error;
    }
  } catch (error) {
    return next(errorHandler(401, "Invalid Access Token"));
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(errorHandler(401, "UnAuthorized - Not an Admin"));
  }
};
