import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

/**
 * Create a purchase (LogisticsOfficer or Admin)
 * Body: { base_id, asset_id, quantity, unit_cost }
 */
export const createPurchase = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const { base_id, asset_id, quantity, unit_cost } = req.body;
    if (!base_id || !asset_id || !quantity) return next(errorHandler(400, "base_id, asset_id and quantity required"));

    // scopeToBase should ensure non-Admin can only create for their base
    await conn.beginTransaction();

    // insert purchase
    const total_cost = (unit_cost || 0) * Number(quantity);
    const [pRes] = await conn.query(
      "INSERT INTO purchases (base_id, asset_id, quantity, unit_price, total_cost, purchased_by) VALUES (?,?,?,?,?,?)",
      [base_id, asset_id, quantity, unit_cost || null, total_cost, req.user.id]
    );
    const purchaseId = pRes.insertId;

    // update or insert asset_stocks
    const [stockRows] = await conn.query("SELECT quantity FROM asset_stocks WHERE base_id = ? AND asset_id = ? FOR UPDATE", [base_id, asset_id]);
    if (stockRows.length) {
      await conn.query("UPDATE asset_stocks SET quantity = quantity + ? WHERE base_id = ? AND asset_id = ?", [quantity, base_id, asset_id]);
    } else {
      await conn.query("INSERT INTO asset_stocks (base_id, asset_id, quantity) VALUES (?,?,?)", [base_id, asset_id, quantity]);
    }

    // ledger entry
    await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [base_id, asset_id, Number(quantity), 'purchase', purchaseId, 'Purchase recorded']);

    await conn.commit();
    res.status(201).json({ message: "Purchase recorded", purchaseId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

export const listPurchases = async (req, res, next) => {
  try {
    const { base_id, asset_id, from, to } = req.query;
    const params = [];
    let sql = `SELECT p.id, p.base_id, b.name as base_name, p.asset_id, a.name as asset_name, p.quantity, p.unit_price, p.total_cost, p.purchased_by, p.created_at
               FROM purchases p
               JOIN bases b ON b.id = p.base_id
               JOIN assets a ON a.id = p.asset_id where 1=1`;
    if (base_id) { sql += " AND p.base_id = ?"; params.push(Number(base_id)); }
    if (asset_id) { sql += " AND p.asset_id = ?"; params.push(Number(asset_id)); }
    if (from) { sql += " AND p.created_at >= ?"; params.push(from); }
    if (to) { sql += " AND p.created_at <= ?"; params.push(to); }
    sql += " ORDER BY p.created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};
