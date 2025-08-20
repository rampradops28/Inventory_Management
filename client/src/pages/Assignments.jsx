import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Assignments() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ asset_id: "", assigned_to: "", quantity: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
    fetchAssignments();
    // eslint-disable-next-line
  }, []);

  const fetchAssets = async () => {
    try {
      const { data } = await API.get("/api/assets");
      setAssets(data);
    } catch (e) { console.error(e); }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/assignments", { params: user?.role !== "Admin" ? { base_id: user.base_id } : {} });
      setAssignments(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitAssignment = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/assignments", { ...form, base_id: user?.base_id });
      setForm({ asset_id: "", assigned_to: "", quantity: 1 });
      fetchAssignments();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to assign asset");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Assignments</h3>

      <div className="card p-3 mb-3">
        <h5>Assign Asset</h5>
        <form onSubmit={submitAssignment}>
          <div className="row g-2">
            <div className="col-md-3">
              <label>Asset</label>
              <select className="form-control" value={form.asset_id} onChange={e => setForm({ ...form, asset_id: e.target.value })} required>
                <option value="">--Select--</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label>Assign To</label>
              <input className="form-control" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <label>Quantity</label>
              <input type="number" min={1} className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100">Assign</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card p-3">
        <h5>Assignments History</h5>
        {loading ? <p>Loading...</p> :
          <table className="table table-sm">
            <thead><tr><th>Asset</th><th>Quantity</th><th>Assigned To</th><th>Date</th></tr></thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td>{a.asset_name}</td>
                  <td>{a.quantity}</td>
                  <td>{a.assigned_to}</td>
                  <td>{new Date(a.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
