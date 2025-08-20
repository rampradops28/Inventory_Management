import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

/**
 * Create transfer (LogisticsOfficer or Admin)
 * Body: { from_base_id, to_base_id, asset_id, quantity }
 * If creator is Admin -> auto-approved; else pending approval by Admin.
 */
export const createTransfer = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const { from_base_id, to_base_id, asset_id, quantity } = req.body;
    if (!from_base_id || !to_base_id || !asset_id || !quantity) return next(errorHandler(400, "from_base_id,to_base_id,asset_id,quantity required"));
    if (from_base_id === to_base_id) return next(errorHandler(400, "from and to bases must differ"));

    // Non-admins must create transfers within their base (scopeToBase middleware)
    const status = (req.user.role === "Admin") ? "Approved" : "Pending";

    await conn.beginTransaction();

    const [resInsert] = await conn.query("INSERT INTO transfers (asset_id, from_base_id, to_base_id, quantity, requested_by, status) VALUES (?,?,?,?,?,?)", [asset_id, from_base_id, to_base_id, quantity, req.user.id, status]);
    const transferId = resInsert.insertId;

    if (status === "Approved") {
      // verify available quantity
      const [stockRows] = await conn.query("SELECT quantity FROM asset_stocks WHERE base_id = ? AND asset_id = ? FOR UPDATE", [from_base_id, asset_id]);
      const available = stockRows.length ? stockRows[0].quantity : 0;
      if (available < Number(quantity)) { await conn.rollback(); return next(errorHandler(400, "Insufficient stock at source base")); }

      // decrement source
      await conn.query("UPDATE asset_stocks SET quantity = quantity - ? WHERE base_id = ? AND asset_id = ?", [quantity, from_base_id, asset_id]);
      // increment dest
      const [destStock] = await conn.query("SELECT quantity FROM asset_stocks WHERE base_id = ? AND asset_id = ? FOR UPDATE", [to_base_id, asset_id]);
      if (destStock.length) {
        await conn.query("UPDATE asset_stocks SET quantity = quantity + ? WHERE base_id = ? AND asset_id = ?", [quantity, to_base_id, asset_id]);
      } else {
        await conn.query("INSERT INTO asset_stocks (base_id, asset_id, quantity) VALUES (?,?,?)", [to_base_id, asset_id, quantity]);
      }

      // ledger entries
      await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [from_base_id, asset_id, -Number(quantity), 'transfer_out', transferId, `Transfer to base ${to_base_id}`]);
      await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [to_base_id, asset_id, Number(quantity), 'transfer_in', transferId, `Transfer from base ${from_base_id}`]);
    }

    await conn.commit();
    res.status(201).json({ message: `Transfer ${status}`, transferId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

export const approveTransfer = async (req, res, next) => {
  // Admin approves pending transfer -> perform stock move
  const conn = await db.getConnection();
  try {
    const id = Number(req.params.id);
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT id, asset_id, from_base_id, to_base_id, quantity, status FROM transfers WHERE id = ? FOR UPDATE", [id]);
    if (!rows.length) { await conn.rollback(); return next(errorHandler(404, "Transfer not found")); }
    const t = rows[0];
    if (t.status !== "Pending") { await conn.rollback(); return next(errorHandler(400, "Transfer not pending")); }

    // check available stock
    const [stock] = await conn.query("SELECT quantity FROM asset_stocks WHERE base_id = ? AND asset_id = ? FOR UPDATE", [t.from_base_id, t.asset_id]);
    const available = stock.length ? stock[0].quantity : 0;
    if (available < t.quantity) { await conn.rollback(); return next(errorHandler(400, "Insufficient stock at source")); }

    // perform movements
    await conn.query("UPDATE asset_stocks SET quantity = quantity - ? WHERE base_id = ? AND asset_id = ?", [t.quantity, t.from_base_id, t.asset_id]);
    const [dest] = await conn.query("SELECT quantity FROM asset_stocks WHERE base_id = ? AND asset_id = ? FOR UPDATE", [t.to_base_id, t.asset_id]);
    if (dest.length) {
      await conn.query("UPDATE asset_stocks SET quantity = quantity + ? WHERE base_id = ? AND asset_id = ?", [t.quantity, t.to_base_id, t.asset_id]);
    } else {
      await conn.query("INSERT INTO asset_stocks (base_id, asset_id, quantity) VALUES (?,?,?)", [t.to_base_id, t.asset_id, t.quantity]);
    }

    await conn.query("UPDATE transfers SET status='Approved', approved_by=?, approved_at=NOW() WHERE id = ?", [req.user.id, id]);

    await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [t.from_base_id, t.asset_id, -Number(t.quantity), 'transfer_out', id, `Approved transfer to ${t.to_base_id}`]);
    await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [t.to_base_id, t.asset_id, Number(t.quantity), 'transfer_in', id, `Approved transfer from ${t.from_base_id}`]);

    await conn.commit();
    res.json({ message: "Transfer approved" });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

export const listTransfers = async (req, res, next) => {
  try {
    const { base_id, status, asset_id, from, to } = req.query;
    const params = [];
    let sql = `SELECT t.*, a.name AS asset_name, bf.name AS from_base_name, bt.name AS to_base_name
               FROM transfers t
               JOIN assets a ON a.id = t.asset_id
               JOIN bases bf ON bf.id = t.from_base_id
               JOIN bases bt ON bt.id = t.to_base_id WHERE 1=1`;
    if (base_id) { sql += " AND (t.from_base_id = ? OR t.to_base_id = ?)"; params.push(base_id, base_id); }
    if (status) { sql += " AND t.status = ?"; params.push(status); }
    if (asset_id) { sql += " AND t.asset_id = ?"; params.push(asset_id); }
    if (from) { sql += " AND t.created_at >= ?"; params.push(from); }
    if (to) { sql += " AND t.created_at <= ?"; params.push(to); }
    sql += " ORDER BY t.created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};
