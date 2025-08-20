import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Purchases() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ base_id: user?.base_id || "", asset_id: "", quantity: 1, unit_cost: 0 });

  useEffect(() => {
    (async () => {
      try {
        const a = await API.get("/api/assets"); setAssets(a.data);
        fetchPurchases();
      } catch (e) { console.error(e); }
    })();
    // eslint-disable-next-line
  }, []);

  async function fetchPurchases() {
    const { data } = await API.get("/api/purchases", { params: user?.role !== "Admin" ? { base_id: user.base_id } : {} });
    setPurchases(data);
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/purchases", { ...form });
      setForm({ base_id: user?.base_id || "", asset_id: "", quantity: 1, unit_cost: 0 });
      fetchPurchases();
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Purchases</h3>

      <div className="card mb-3 p-3">
        <h6>Record Purchase</h6>
        <form onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-2">
              <label>Base ID</label>
              <input className="form-control" value={form.base_id} onChange={e => setForm({...form, base_id: e.target.value})} disabled={user?.role !== "Admin"} required />
            </div>
            <div className="col-md-3">
              <label>Asset</label>
              <select className="form-control" value={form.asset_id} onChange={e => setForm({...form, asset_id: e.target.value})} required>
                <option value="">--select--</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label>Quantity</label>
              <input type="number" className="form-control" value={form.quantity} min={1} onChange={e => setForm({...form, quantity: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <label>Unit cost</label>
              <input type="number" className="form-control" value={form.unit_cost} onChange={e => setForm({...form, unit_cost: e.target.value})} />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card p-3">
        <h6>History</h6>
        <table className="table table-sm">
          <thead><tr><th>ID</th><th>Base</th><th>Asset</th><th>Qty</th><th>Unit</th><th>Date</th></tr></thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id}><td>{p.id}</td><td>{p.base_name}</td><td>{p.asset_name}</td><td>{p.quantity}</td><td>{p.unit_price}</td><td>{new Date(p.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
