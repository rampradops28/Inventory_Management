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

// user model
import User from "../models/user.model.js";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(errorHandler(400, "User already exists"));

    const token = generateVerificationToken();
    const name = email.split("@")[0];
    const user = new User({
      email,
      name,
      password,
      verificationToken: token,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 01 day
    });

    await user.save();
    if (!user) return next(errorHandler(500, "Internal Server Error"));

    const { accessToken, refreshToken } = generateTokens(user._id);
    storeRefreshToken(user._id, refreshToken, next);
    setCookies(res, accessToken, refreshToken, next);
    await sendVerificationEmail(email, token, next);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.log("error in signup", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return next(errorHandler(400, "Verification code is required"));

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return next(errorHandler(400, "Invalid or expired verification code"));

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    const creationDate = new Date(user.createdAt).toDateString();
    await sendWelcomeEmail(user.email, user.name, creationDate, next);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.log("error in verify email", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(errorHandler(400, "Email and Password are required"));

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(400, "Invalid credentials"));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(errorHandler(400, "Invalid credentials"));

    if (!user.isVerified)
      return next(errorHandler(400, "Email is not verified"));

    const { accessToken, refreshToken } = generateTokens(user._id);
    storeRefreshToken(user._id, refreshToken, next);
    setCookies(res, accessToken, refreshToken, next);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (error) {}
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
    console.log("error in logout", error);
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

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(400, "User not found"));

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 01 hour
    await user.save();

    await sendPasswordResetRequestEmail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
      next
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log("error in forgot password", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const resetPassowrd = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password)
      return next(errorHandler(400, "Token and Password are required"));

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) return next(errorHandler(400, "Invalid or expired reset token"));

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendPasswordResetSuccessEmail(user.email, next);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("error in reset password", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));
    res.status(200).json(user);
  } catch (error) {
    console.log("error in get profile", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
