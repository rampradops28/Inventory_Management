import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CommanderPanel() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [transfers, setTransfers] = useState([]);
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
        API.get("/api/assignments", { params: { base_id: user.base_id } }),
        API.get("/api/transfers", { params: { to_base_id: user.base_id } })
      ]);
      setAssignments(aRes.data);
      setTransfers(tRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const approveTransfer = async (id) => {
    try {
      await API.post(`/api/transfers/${id}/approve`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const rejectTransfer = async (id) => {
    try {
      await API.post(`/api/transfers/${id}/reject`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="container mt-4">
      <h3>Commander Panel</h3>

      {loading ? <p>Loading...</p> : (
        <>
          <div className="card p-3 mb-3">
            <h5>Assignments</h5>
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
          </div>

          <div className="card p-3">
            <h5>Pending Transfers</h5>
            {transfers.length === 0 && <p>No pending transfers.</p>}
            <table className="table table-sm">
              <thead><tr><th>Asset</th><th>Quantity</th><th>From Base</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {transfers.map(t => (
                  <tr key={t.id}>
                    <td>{t.asset_name}</td>
                    <td>{t.quantity}</td>
                    <td>{t.from_base_id}</td>
                    <td>{t.status}</td>
                    <td>
                      {t.status === "Pending" && (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => approveTransfer(t.id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => rejectTransfer(t.id)}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
