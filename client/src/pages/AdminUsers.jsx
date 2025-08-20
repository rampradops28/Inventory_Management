import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => fetchUsers(), []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/admin/users");
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleActive = async (id, isActive) => {
    try {
      await API.post(`/api/admin/users/${id}/toggle-active`, { is_active: isActive ? 0 : 1 });
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const verifyUser = async (id) => {
    try {
      await API.post(`/api/admin/users/${id}/verify`);
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await API.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="container mt-4">
      <h3>Admin: Users Management</h3>
      {loading ? <p>Loading...</p> :
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Base ID</th>
                <th>Verified</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.base_id}</td>
                  <td>{u.is_verified ? "Yes" : "No"}</td>
                  <td>{u.is_active ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary me-1" onClick={() => toggleActive(u.id, u.is_active)}>
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                    {!u.is_verified && (
                      <button className="btn btn-sm btn-success me-1" onClick={() => verifyUser(u.id)}>Verify</button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>Delete</button>
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
