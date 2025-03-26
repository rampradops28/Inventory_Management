import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import { redis } from "../lib/redis.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetRequestEmail,
  sendPasswordResetSuccessEmail,
} from "../mailtrap/mailtrapEmail.js";
import db from "../lib/db.js";
import bcrypt from "bcryptjs";

dotenv.config();

// generate verification token for email verification
const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// generate jwt tokens
const generateTokens = (user_id) => {
  const accessToken = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// store refresh token on redis
const storeRefreshToken = async (user_id, refreshToken, next) => {
  try {
    await redis.set(
      `refresh_token_${user_id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// setCookie
const setCookies = (res, accessToken, refreshToken, next) => {
  try {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(errorHandler(400, "Email and Password are required"));

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return next(errorHandler(400, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = generateVerificationToken();
    const name = email.split("@")[0];

    // Insert the new user into the database
    const [result] = await db.query(
      "INSERT INTO users (email, name, password_hash, verification_token, verification_token_expires_at) VALUES (?, ?, ?, ?, ?)",
      [
        email,
        name,
        hashedPassword,
        token,
        new Date(Date.now() + 24 * 60 * 60 * 1000),
      ]
    );

    // Get the ID of the newly inserted user
    const userId = result.insertId;

    // Fetch the created user from the database, excluding the password
    const [createdUser] = await db.query(
      "SELECT id, email, name, is_verified, role, address, contact, created_at FROM users WHERE id = ?",
      [userId]
    );

    const { accessToken, refreshToken } = generateTokens(userId);

    await storeRefreshToken(userId, refreshToken, next);

    setCookies(res, accessToken, refreshToken);

    await sendVerificationEmail(email, token, next);

    res.status(201).json({ user: createdUser[0] });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return next(errorHandler(400, "Verification code is required"));

    const [user] = await db.query(
      "SELECT id, email, name, is_verified, role, address, contact, created_at FROM users WHERE verification_token = ? AND verification_token_expires_at > NOW()",
      [code]
    );

    if (user.length === 0)
      return next(errorHandler(400, "Invalid or expired verification code"));

    db.query(
      "UPDATE users SET is_verified = true, verification_token = NULL, verification_token_expires_at = NULL WHERE id = ?",
      [user[0].id]
    );

    await sendWelcomeEmail(
      user[0].email,
      user[0].name,
      new Date(user[0].created_at).toDateString(),
      next
    );

    const [afterVerified] = await db.query(
      "SELECT id, email, name, is_verified, role, address, contact, created_at FROM users WHERE id = ?",
      [user[0].id]
    );

    res.status(200).json({ user: afterVerified[0] });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(errorHandler(400, "Email and Password are required"));

    const [user] = await db.query(
      "SELECT id, email, name, is_verified, role, address, contact, created_at, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0)
      return next(errorHandler(400, "Invalid credentials"));

    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) return next(errorHandler(400, "Invalid credentials"));

    if (!user[0].is_verified)
      return next(errorHandler(400, "Email is not verified"));

    const { accessToken, refreshToken } = generateTokens(user[0].id);
    await storeRefreshToken(user[0].id, refreshToken, next);
    setCookies(res, accessToken, refreshToken);

    const userWithoutPassword = { ...user[0] };
    delete userWithoutPassword.password_hash;

    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.log("Error in login:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token_${decode.user_id}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(errorHandler(401, "Unauthorized"));

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = await redis.get(`refresh_token_${decode.user_id}`);
    if (refreshToken !== token) return next(errorHandler(401, "Unauthorized"));

    const accessToken = jwt.sign(
      { user_id: decode.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("error in refresh token", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "Email is required"));

    const [result] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0) return next(errorHandler(400, "User not found"));

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await db.query(
      "UPDATE users SET reset_password_token = ?, reset_password_expires_at = ? WHERE email = ?",
      [resetToken, resetPasswordExpiresAt, email]
    );

    await sendPasswordResetRequestEmail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
      next
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    console.log(resetToken);
    const { password } = req.body;

    if (!resetToken || !password)
      return next(errorHandler(400, "Token and Password are required"));

    const [result] = await db.query(
      "SELECT id, email FROM users WHERE reset_password_token = ? AND reset_password_expires_at > NOW()",
      [resetToken]
    );

    console.log(result);

    if (result.length === 0)
      return next(errorHandler(400, "Invalid or expired reset token"));

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires_at = NULL WHERE id = ?",
      [hashedPassword, result[0].id]
    );

    await sendPasswordResetSuccessEmail(result[0].email, next);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [result] = await db.query(
      "SELECT id, email, name, is_verified, role, address, contact, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (result.length === 0) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ user: result[0] });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
