import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Transfers() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState({
    from_base_id: user?.base_id || "",
    to_base_id: "",
    asset_id: "",
    quantity: 1
  });
  const [loading, setLoading] = useState(false);

  // Fetch assets and bases on load
  useEffect(() => {
    (async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          API.get("/api/assets"),
          API.get("/api/bases")
        ]);
        setAssets(aRes.data);
        setBases(bRes.data);
        fetchTransfers();
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const params = user?.role !== "Admin" ? { base_id: user.base_id } : {};
      const { data } = await API.get("/api/transfers", { params });
      setTransfers(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    if(form.from_base_id === form.to_base_id) {
      alert("From and To base cannot be the same");
      return;
    }
    try {
      await API.post("/api/transfers", form);
      setForm({ from_base_id: user?.base_id || "", to_base_id: "", asset_id: "", quantity: 1 });
      fetchTransfers();
    } catch (e) {
      alert(e?.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Transfers</h3>

      {(user?.role === "Admin" || user?.role === "LogisticsOfficer") && (
        <div className="card mb-3 p-3">
          <h6>Record Transfer</h6>
          <form onSubmit={submitTransfer}>
            <div className="row g-2">
              <div className="col-md-3">
                <label>From Base</label>
                <select className="form-control" value={form.from_base_id} onChange={e => setForm({...form, from_base_id: e.target.value})} required disabled={user?.role !== "Admin"}>
                  <option value="">--select--</option>
                  {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label>To Base</label>
                <select className="form-control" value={form.to_base_id} onChange={e => setForm({...form, to_base_id: e.target.value})} required>
                  <option value="">--select--</option>
                  {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
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
                <input type="number" min={1} className="form-control" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-primary w-100">Transfer</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <h6>Transfer History</h6>
        {loading ? <p>Loading...</p> :
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>From Base</th>
                  <th>To Base</th>
                  <th>Asset</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.from_base_name}</td>
                    <td>{t.to_base_name}</td>
                    <td>{t.asset_name}</td>
                    <td>{t.quantity}</td>
                    <td>{t.status}</td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
