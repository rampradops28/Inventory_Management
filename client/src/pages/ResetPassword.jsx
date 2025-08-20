import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match");

    try {
      await API.post("/api/auth/reset-password", { token, password });
      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Reset Password</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>New Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <button className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
}
