import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ base_id: user?.base_id || "", equipment_type: "", from: "", to: "" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        // set default base for non-admins
        if (user.role !== "Admin") setFilters(f => ({ ...f, base_id: user.base_id }));
        fetchData();
      }
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      // if empty base_id, remove param so backend treats it as all bases
      if (!params.base_id) delete params.base_id;
      const { data } = await API.get("/api/dashboard", { params });
      setRows(data);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const openBreakdown = async (asset) => {
    // fetch purchases + transfers for this asset & base
    setSelectedAsset(asset);
    try {
      const params = { asset_id: asset.asset_id, base_id: filters.base_id };
      const [pRes, tRes] = await Promise.all([
        API.get("/api/purchases", { params }),
        API.get("/api/transfers", { params }),
      ]);
      setBreakdown({ purchases: pRes.data, transfers: tRes.data });
    } catch (e) {
      console.error(e);
      setBreakdown({ purchases: [], transfers: [] });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Dashboard</h3>

      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-3">
            <label>Base ID</label>
            <input className="form-control" value={filters.base_id || ""} onChange={e => setFilters(f => ({...f, base_id: e.target.value}))} disabled={user?.role !== "Admin"} />
          </div>
          <div className="col-md-3">
            <label>Equipment Type</label>
            <input className="form-control" value={filters.equipment_type} onChange={e => setFilters(f => ({...f, equipment_type: e.target.value}))} />
          </div>
          <div className="col-md-2">
            <label>From</label>
            <input type="date" className="form-control" value={filters.from} onChange={e => setFilters(f => ({...f, from: e.target.value}))} />
          </div>
          <div className="col-md-2">
            <label>To</label>
            <input type="date" className="form-control" value={filters.to} onChange={e => setFilters(f => ({...f, to: e.target.value}))} />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary me-2" onClick={fetchData}>Apply</button>
            <button className="btn btn-secondary" onClick={() => setFilters({ base_id: user?.base_id || "", equipment_type: "", from: "", to: "" })}>Reset</button>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <h5>Per-asset summary</h5>
        {loading ? <p>Loading...</p> :
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Asset</th><th>Type</th><th>Opening</th><th>Purchases</th><th>Transfer In</th><th>Transfer Out</th><th>Assigned</th><th>Expended</th><th>Closing</th><th>Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.asset_id}>
                    <td>{r.asset_name}</td>
                    <td>{r.equipment_type}</td>
                    <td>{r.opening_balance}</td>
                    <td>{r.purchases}</td>
                    <td>{r.transfer_in}</td>
                    <td>{r.transfer_out}</td>
                    <td>{r.assigned}</td>
                    <td>{r.expended}</td>
                    <td>{r.closing_balance}</td>
                    <td><button className="btn btn-sm btn-outline-primary" onClick={() => openBreakdown(r)}>Net Movement</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {selectedAsset && breakdown && (
        <div className="card p-3 mt-3">
          <h5>Details for {selectedAsset.asset_name}</h5>
          <div className="row">
            <div className="col-md-6">
              <h6>Purchases</h6>
              <ul className="list-group">
                {breakdown.purchases.length === 0 && <li className="list-group-item">No purchases</li>}
                {breakdown.purchases.map(p => (
                  <li key={p.id} className="list-group-item">Qty: {p.quantity} | Base: {p.base_name} | {new Date(p.created_at).toLocaleString()}</li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Transfers</h6>
              <ul className="list-group">
                {breakdown.transfers.length === 0 && <li className="list-group-item">No transfers</li>}
                {breakdown.transfers.map(t => (
                  <li key={t.id} className="list-group-item">{t.status} | From: {t.from_base_id} | To: {t.to_base_id} | Qty: {t.quantity} | {new Date(t.created_at).toLocaleString()}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-secondary" onClick={() => { setSelectedAsset(null); setBreakdown(null); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
