import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function LogisticsPanel() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState({ asset_id: "", from_base_id: user?.base_id || "", to_base_id: "", quantity: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, tRes] = await Promise.all([
        API.get("/api/assets"),
        API.get("/api/transfers", { params: { from_base_id: user.base_id } })
      ]);
      setAssets(aRes.data);
      setTransfers(tRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/transfers", form);
      setForm({ asset_id: "", from_base_id: user?.base_id || "", to_base_id: "", quantity: 1 });
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Logistics Panel</h3>

      <div className="card p-3 mb-3">
        <h5>Create Transfer</h5>
        <form onSubmit={submitTransfer}>
          <div className="row g-2">
            <div className="col-md-3">
              <label>Asset</label>
              <select className="form-control" value={form.asset_id} onChange={e => setForm({...form, asset_id: e.target.value})} required>
                <option value="">--Select--</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label>To Base ID</label>
              <input className="form-control" value={form.to_base_id} onChange={e => setForm({...form, to_base_id: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <label>Quantity</label>
              <input type="number" className="form-control" value={form.quantity} min={1} onChange={e => setForm({...form, quantity: e.target.value})} required />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100">Create</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card p-3">
        <h5>Transfers History</h5>
        {loading ? <p>Loading...</p> :
          <table className="table table-sm">
            <thead><tr><th>Asset</th><th>Quantity</th><th>To Base</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t.id}>
                  <td>{t.asset_name}</td>
                  <td>{t.quantity}</td>
                  <td>{t.to_base_id}</td>
                  <td>{t.status}</td>
                  <td>{new Date(t.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
