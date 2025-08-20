import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", base_id: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sends exactly what backend expects
      const { data } = await API.post("auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        base_id: form.base_id
      });
      alert(data.message || "Registered successfully! Verify email.");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label>Base ID</label>
          <input className="form-control" value={form.base_id} onChange={e => setForm({...form, base_id: e.target.value})} required />
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  );
}
