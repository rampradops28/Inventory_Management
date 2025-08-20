import db from "../lib/db.js";

/**
 * GET /api/dashboard
 * Query: base_id, equipment_type, from, to
 * Returns per-asset metrics: opening_balance, purchases, transfers_in, transfers_out, assignments, expended, closing_balance
 */
export const getDashboard = async (req, res, next) => {
  try {
    const { base_id, equipment_type, from, to } = req.query;
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    // We'll compute per asset for the base (or all bases if admin)
    // For simplicity, filter by base_id if provided else across all bases
    // Opening balance = sum of stock_ledger.change_amount < fromDate (if fromDate provided) OR 0
    // For small to medium datasets this approach is acceptable

    const params = [];
    let assetFilter = "";
    if (equipment_type) {
      assetFilter = " AND a.equipment_type = ?";
      params.push(equipment_type);
    }

    const baseFilter = base_id ? " AND sl.base_id = ?" : "";
    if (base_id) params.push(Number(base_id));

    // We will get list of assets (id, name, type)
    const [assets] = await db.query(`SELECT a.id, a.name, a.equipment_type FROM assets a WHERE 1=1 ${equipment_type ? " AND a.equipment_type = ?" : ""}`, equipment_type ? [equipment_type] : []);

    const results = [];
    for (const a of assets) {
      // opening balance
      let opening = 0;
      if (fromDate) {
        const [opRows] = await db.query(
          `SELECT COALESCE(SUM(change_amount),0) AS opening FROM stock_ledger sl WHERE sl.asset_id = ? AND sl.created_at < ? ${base_id ? " AND sl.base_id = ?" : ""}`,
          base_id ? [a.id, fromDate, Number(base_id)] : [a.id, fromDate]
        );
        opening = opRows[0].opening;
      } else {
        // opening = sum of all ledger before beginning of time -> set to 0
        const [opRows] = await db.query(
          `SELECT COALESCE(SUM(change_amount),0) AS opening FROM stock_ledger sl WHERE sl.asset_id = ? ${base_id ? " AND sl.base_id = ?" : ""}`,
          base_id ? [a.id, Number(base_id)] : [a.id]
        );
        opening = opRows[0].opening;
      }

      // purchases in range
      const purchaseWhere = [];
      const purchaseParams = [a.id];
      let purchaseSql = `SELECT COALESCE(SUM(quantity),0) AS purchases FROM purchases p WHERE p.asset_id = ?`;
      if (base_id) { purchaseSql += " AND p.base_id = ?"; purchaseParams.push(Number(base_id)); }
      if (fromDate) { purchaseSql += " AND p.created_at >= ?"; purchaseParams.push(fromDate); }
      if (toDate) { purchaseSql += " AND p.created_at <= ?"; purchaseParams.push(toDate); }
      const [[purch]] = await db.query(purchaseSql, purchaseParams);

      // transfers_in
      const transferInSql = `SELECT COALESCE(SUM(quantity),0) AS transfer_in FROM transfers t WHERE t.asset_id = ? AND t.status='Approved' ${base_id ? " AND t.to_base_id = ?" : ""} ${fromDate ? " AND t.created_at >= ?" : ""} ${toDate ? " AND t.created_at <= ?" : ""}`;
      const transferInParams = [];
      transferInParams.push(a.id);
      if (base_id) transferInParams.push(Number(base_id));
      if (fromDate) transferInParams.push(fromDate);
      if (toDate) transferInParams.push(toDate);
      const [[tIn]] = await db.query(transferInSql, transferInParams);

      // transfers_out
      const transferOutSql = `SELECT COALESCE(SUM(quantity),0) AS transfer_out FROM transfers t WHERE t.asset_id = ? AND t.status='Approved' ${base_id ? " AND t.from_base_id = ?" : ""} ${fromDate ? " AND t.created_at >= ?" : ""} ${toDate ? " AND t.created_at <= ?" : ""}`;
      const transferOutParams = [];
      transferOutParams.push(a.id);
      if (base_id) transferOutParams.push(Number(base_id));
      if (fromDate) transferOutParams.push(fromDate);
      if (toDate) transferOutParams.push(toDate);
      const [[tOut]] = await db.query(transferOutSql, transferOutParams);

      // assignments
      const assignSql = `SELECT COALESCE(SUM(quantity),0) AS assigned FROM assignments asg WHERE asg.asset_id = ? ${base_id ? " AND asg.base_id = ?" : ""} ${fromDate ? " AND asg.created_at >= ?" : ""} ${toDate ? " AND asg.created_at <= ?" : ""}`;
      const assignParams = [a.id];
      if (base_id) assignParams.push(Number(base_id));
      if (fromDate) assignParams.push(fromDate);
      if (toDate) assignParams.push(toDate);
      const [[asg]] = await db.query(assignSql, assignParams);

      // expended
      const expSql = `SELECT COALESCE(SUM(quantity),0) AS expended FROM expenditures e WHERE e.asset_id = ? ${base_id ? " AND e.base_id = ?" : ""} ${fromDate ? " AND e.created_at >= ?" : ""} ${toDate ? " AND e.created_at <= ?" : ""}`;
      const expParams = [a.id];
      if (base_id) expParams.push(Number(base_id));
      if (fromDate) expParams.push(fromDate);
      if (toDate) expParams.push(toDate);
      const [[exp]] = await db.query(expSql, expParams);

      // closing = opening + purchases + transfer_in - transfer_out - expended - assigned? (we are tracking assigned as depletion)
      const closing = Number(opening) + Number(purch.purchases || 0) + Number(tIn.transfer_in || 0) - Number(tOut.transfer_out || 0) - Number(exp.expended || 0) - Number(asg.assigned || 0);

      results.push({
        asset_id: a.id,
        asset_name: a.name,
        equipment_type: a.equipment_type,
        opening_balance: Number(opening),
        purchases: Number(purch.purchases || 0),
        transfer_in: Number(tIn.transfer_in || 0),
        transfer_out: Number(tOut.transfer_out || 0),
        assigned: Number(asg.assigned || 0),
        expended: Number(exp.expended || 0),
        closing_balance: Number(closing)
      });
    }

    res.json(results);
  } catch (err) { next(err); }
};
