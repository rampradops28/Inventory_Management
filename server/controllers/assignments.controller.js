import db from "../lib/db.js";
import { errorHandler } from "../utils/errorHandler.js";

/**
 * Assign an asset to personnel (BaseCommander or Admin)
 * Body: { base_id, asset_id, assigned_to, quantity, note }
 */
export const createAssignment = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const { base_id, asset_id, assigned_to, quantity, note } = req.body;
    if (!base_id || !asset_id || !assigned_to || !quantity) return next(errorHandler(400, "base_id, asset_id, assigned_to, quantity required"));

    await conn.beginTransaction();

    // check stock
    const [stock] = await conn.query("SELECT quantity FROM asset_stocks WHERE base_id = ? AND asset_id = ? FOR UPDATE", [base_id, asset_id]);
    const available = stock.length ? stock[0].quantity : 0;
    if (available < quantity) { await conn.rollback(); return next(errorHandler(400, "Insufficient stock")); }

    // reduce stock
    await conn.query("UPDATE asset_stocks SET quantity = quantity - ? WHERE base_id = ? AND asset_id = ?", [quantity, base_id, asset_id]);

    // create assignment
    const [ins] = await conn.query("INSERT INTO assignments (base_id, asset_id, assigned_to, quantity, assigned_by, note) VALUES (?,?,?,?,?,?)", [base_id, asset_id, assigned_to, quantity, req.user.id, note || null]);
    const assignmentId = ins.insertId;

    // ledger
    await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [base_id, asset_id, -Number(quantity), 'assignment', assignmentId, note || "Assigned to personnel"]);

    await conn.commit();
    res.status(201).json({ message: "Assigned", assignmentId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

/**
 * Mark assignment as expended (reduce nothing additional; just record expenditure)
 * Body: { quantity, reason }
 */
export const markExpended = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const assignmentId = Number(req.params.id);
    const { quantity, reason } = req.body;
    if (!assignmentId || !quantity) return next(errorHandler(400, "assignment id & quantity required"));

    await conn.beginTransaction();

    const [[assignment]] = await conn.query("SELECT * FROM assignments WHERE id = ? FOR UPDATE", [assignmentId]);
    if (!assignment) { await conn.rollback(); return next(errorHandler(404, "Assignment not found")); }
    if (assignment.status === "Expended") { await conn.rollback(); return next(errorHandler(400, "Already expended")); }

    // create expenditure record
    const [ins] = await conn.query("INSERT INTO expenditures (assignment_id, base_id, asset_id, quantity, reason, reported_by) VALUES (?,?,?,?,?,?)", [assignmentId, assignment.base_id, assignment.asset_id, quantity, reason || null, req.user.id]);

    // ledger entry: expended -> negative
    await conn.query("INSERT INTO stock_ledger (base_id, asset_id, change_amount, type, ref_id, note) VALUES (?,?,?,?,?,?)", [assignment.base_id, assignment.asset_id, -Number(quantity), 'expenditure', ins.insertId, reason || "Expended"]);

    // mark assignment as partially expended or fully depending on business logic
    // Here we update status to Expended if quantity >= assigned quantity
    if (Number(quantity) >= Number(assignment.quantity)) {
      await conn.query("UPDATE assignments SET status='Expended' WHERE id = ?", [assignmentId]);
    }

    await conn.commit();
    res.json({ message: "Marked expended", expenditureId: ins.insertId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};
