import { errorHandler } from "../utils/errorHandler.js";
import db from "../lib/db.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query(
      "SELECT id,name,email,contact,address, created_at, image_url FROM users WHERE role = 'member'"
    );

    res.status(200).json({ users });
  } catch (error) {
    console.log("error in getting users for admin", error);
    next(errorHandler(500, "An error occurred"));
  }
};
