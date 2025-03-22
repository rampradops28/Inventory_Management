import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// local dependencies
import { errorHandler } from "../utils/errorHandler.js";
import { redis } from "../lib/redis.js";

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
  } catch (error) {}
};

export const login = async (req, res, next) => {
  try {
  } catch (error) {}
};

export const verifyEmail = async (req, res, next) => {
  try {
  } catch (error) {}
};
