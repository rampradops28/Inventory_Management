import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminRBAC() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => fetchRequests(), []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/role-requests");
      setRequests(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      await API.post(`/api/role-requests/${id}/${action}`);
      fetchRequests();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="container mt-4">
      <h3>Admin: Role Requests</h3>
      {loading ? <p>Loading...</p> :
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Requested Role</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user_name}</td>
                  <td>{r.requested_role}</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>
                    {r.status === "Pending" && (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => handleAction(r.id, "approve")}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleAction(r.id, "reject")}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}
