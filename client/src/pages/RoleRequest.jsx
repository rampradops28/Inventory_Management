import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function RoleRequest() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/role-requests", { params: user?.role === "Admin" ? {} : { user_id: user.id } });
      setRequests(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/role-requests", { role });
      setRole("");
      fetchRequests();
    } catch (e) { alert(e?.response?.data?.message || "Failed"); }
  };

  const approveRequest = async (id) => {
    try {
      await API.post(`/api/role-requests/${id}/approve`);
      fetchRequests();
    } catch (e) { console.error(e); }
  };

  const rejectRequest = async (id) => {
    try {
      await API.post(`/api/role-requests/${id}/reject`);
      fetchRequests();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="container mt-4">
      <h3>Role Requests</h3>

      {user?.role !== "Admin" && (
        <div className="card mb-3 p-3">
          <h5>Request New Role</h5>
          <form onSubmit={submitRequest}>
            <div className="row g-2">
              <div className="col-md-4">
                <input className="form-control" placeholder="Role (e.g., Commander)" value={role} onChange={e => setRole(e.target.value)} required />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-primary w-100">Request</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <h5>Requests</h5>
        {loading ? <p>Loading...</p> :
          <table className="table table-sm">
            <thead><tr><th>User</th><th>Role</th><th>Status</th>{user?.role === "Admin" && <th>Actions</th>}</tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.user_name}</td>
                  <td>{r.role}</td>
                  <td>{r.status}</td>
                  {user?.role === "Admin" && (
                    <td>
                      {r.status === "Pending" && (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => approveRequest(r.id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => rejectRequest(r.id)}>Reject</button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
