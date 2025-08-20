import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

const generateVerificationToken = () => Math.floor(100000 + Math.random() * 900000).toString();

const signTokens = (user) => {
  const payload = { id: user.id, role: user.role, base_id: user.base_id };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 15*60*1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict", maxAge: 7*24*60*60*1000 });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name, base_id } = req.body;
    if (!email || !password || !base_id) return next(errorHandler(400, "email, password and base_id required"));

    const [base] = await db.query("SELECT id FROM bases WHERE id=?", [base_id]);
    if (base.length === 0) return next(errorHandler(400, "Invalid base_id"));

    const [exists] = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length) return next(errorHandler(400, "Email already registered"));

    const hashed = await bcrypt.hash(password, 10);
    const token = generateVerificationToken();
    const expires = new Date(Date.now() + 24*60*60*1000);

    // default role_id = 2 (BaseCommander)
    await db.query(
      `INSERT INTO users (email, name, password_hash, verification_token, verification_token_expires_at, role_id, base_id, is_verified)
       VALUES (?,?,?,?,?,?,?,?)`,
      [email, name || email.split("@")[0], hashed, token, expires, 2, base_id, 0]
    );

    const [[user]] = await db.query(
      `SELECT u.id, u.email, u.name, r.name AS role, u.base_id, u.is_verified FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email=?`,
      [email]
    );

    const { accessToken, refreshToken } = signTokens(user);
    setCookies(res, accessToken, refreshToken);

    // TODO: send verification token via secure internal channel

    return res.status(201).json({ message: "Registered (BaseCommander). Verify email to activate.", user });
  } catch (err) { next(err); }
};

// export const verifyEmail = async (req, res, next) => {
//   try {
//     const { code } = req.body;
//     if (!code) return next(errorHandler(400, "Verification code required"));

//     const [rows] = await db.query("SELECT id FROM users WHERE verification_token = ? AND verification_token_expires_at > NOW()", [code]);
//     if (rows.length === 0) return next(errorHandler(400, "Invalid or expired code"));

//     await db.query("UPDATE users SET is_verified=1, verification_token=NULL, verification_token_expires_at=NULL WHERE id=?", [rows[0].id]);

//     const [[user]] = await db.query(
//       `SELECT u.id, u.email, u.name, r.name AS role, u.base_id, u.is_verified FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id = ?`,
//       [rows[0].id]
//     );

//     return res.json({ message: "Email verified", user });
//   } catch (err) { next(err); }
// };

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(errorHandler(400, "Email and password required"));

    const [rows] = await db.query(
      `SELECT u.id, u.email, u.name, u.password_hash, r.name AS role, u.base_id, u.is_verified, u.is_active FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email = ?`,
      [email]
    );
    if (rows.length === 0) return next(errorHandler(400, "Invalid credentials"));

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return next(errorHandler(400, "Invalid credentials"));
    // if (!user.is_verified) return next(errorHandler(403, "Email not verified"));
    if (user.is_active === 0) return next(errorHandler(403, "Account inactive"));

    const { accessToken, refreshToken } = signTokens(user);
    setCookies(res, accessToken, refreshToken);

    return res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name, role: user.role, base_id: user.base_id }
    });
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logout success" });
  } catch (err) { next(err); }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(errorHandler(401, "No refresh token"));

    let payload;
    try { payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET); } 
    catch(e) { return next(errorHandler(401, "Invalid refresh token")); }

    // fetch fresh user info
    const [rows] = await db.query(`SELECT u.id, r.name AS role, u.base_id, u.is_active FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id = ?`, [payload.id]);
    if (!rows.length || rows[0].is_active === 0) return next(errorHandler(401, "Unauthorized"));

    const user = rows[0];
    const accessToken = jwt.sign({ id: user.id, role: user.role, base_id: user.base_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production", maxAge: 15*60*1000 });
    return res.json({ message: "Access token refreshed" });
  } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "Email required"));

    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.json({ message: "If email exists, an invite to reset is sent" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 60*60*1000);
    await db.query("UPDATE users SET reset_password_token = ?, reset_password_expires_at = ? WHERE email = ?", [resetToken, expires, email]);

    // TODO: send reset link securely via internal channel
    return res.json({ message: "Password reset instructions sent (if email exists)" });
  } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    if (!resetToken || !password) return next(errorHandler(400, "Token and new password required"));

    const [rows] = await db.query("SELECT id FROM users WHERE reset_password_token = ? AND reset_password_expires_at > NOW()", [resetToken]);
    if (!rows.length) return next(errorHandler(400, "Invalid or expired token"));

    const hashed = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires_at = NULL WHERE id = ?", [hashed, rows[0].id]);

    return res.json({ message: "Password reset successful" });
  } catch (err) { next(err); }
};

export const getProfile = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.name, r.name AS role, u.base_id, u.is_verified, u.address, u.contact, u.created_at, u.image_url
       FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?`,
      [req.user.id]
    );
    if (!rows.length) return next(errorHandler(404, "User not found"));
    return res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, address, contact, image_url } = req.body;
    await db.query("UPDATE users SET name=?, address=?, contact=?, image_url=? WHERE id=?", [name || null, address || null, contact || null, image_url || null, req.user.id]);
    const [rows] = await db.query(`SELECT u.id, u.email, u.name, r.name AS role, u.base_id, u.is_verified, u.address, u.contact, u.created_at, u.image_url FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?`, [req.user.id]);
    return res.json({ user: rows[0] });
  } catch (err) { next(err); }
};
