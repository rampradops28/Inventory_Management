import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

// Create a new asset (Admin or LogisticsOfficer)
export const createAsset = async (req, res, next) => {
  try {
    const { name, equipment_type, description } = req.body;
    if (!name || !equipment_type) return next(errorHandler(400, "name & equipment_type required"));

    const [result] = await db.query("INSERT INTO assets (name, equipment_type, description) VALUES (?,?,?)", [name, equipment_type, description || null]);
    const [[asset]] = await db.query("SELECT * FROM assets WHERE id = ?", [result.insertId]);
    res.status(201).json({ asset });
  } catch (err) { next(err); }
};

// List assets (filter by equipment_type optional)
export const listAssets = async (req, res, next) => {
  try {
    const { equipment_type } = req.query;
    let sql = "SELECT * FROM assets";
    const params = [];
    if (equipment_type) { sql += " WHERE equipment_type = ?"; params.push(equipment_type); }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

// Get asset stock by base
export const getAssetStock = async (req, res, next) => {
  try {
    const assetId = Number(req.params.id);
    if (!assetId) return next(errorHandler(400, "asset id required"));

    const [rows] = await db.query(
      `SELECT s.base_id, b.name AS base_name, s.quantity
       FROM asset_stocks s JOIN bases b ON b.id = s.base_id WHERE s.asset_id = ?`,
      [assetId]
    );
    res.json(rows);
  } catch (err) { next(err); }
};
