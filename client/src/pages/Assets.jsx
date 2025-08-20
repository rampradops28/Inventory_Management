import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Assets() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ name: "", equipment_type: "", description: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => fetchAssets(), []); // eslint-disable-line

  async function fetchAssets() {
    setLoading(true);
    try {
      const { data } = await API.get("/api/assets");
      setAssets(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/assets", form);
      setForm({ name: "", equipment_type: "", description: ""});
      fetchAssets();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    }
  };

  const viewStock = async (assetId) => {
    try {
      const { data } = await API.get(`/api/assets/${assetId}/stock`);
      alert("Stock per base:\n" + data.map(d => `${d.base_name}: ${d.quantity}`).join("\n"));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="container mt-4">
      <h3>Assets</h3>
      {(user?.role === "Admin" || user?.role === "LogisticsOfficer") && (
        <div className="card mb-3 p-3">
          <h6>Create Asset</h6>
          <form onSubmit={create}>
            <div className="row g-2">
              <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="col-md-3"><input className="form-control" placeholder="Type" value={form.equipment_type} onChange={e => setForm({...form, equipment_type: e.target.value})} required/></div>
              <div className="col-md-4"><input className="form-control" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="col-md-1"><button className="btn btn-primary w-100">Add</button></div>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <h6>All assets</h6>
        {loading ? <p>Loading...</p> :
          <table className="table table-sm">
            <thead><tr><th>Name</th><th>Type</th><th>Action</th></tr></thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.equipment_type}</td>
                  <td><button className="btn btn-sm btn-outline-secondary" onClick={() => viewStock(a.id)}>Stock</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
