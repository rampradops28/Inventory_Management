import React, { useState } from "react";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/forgot-password", { email });
      setMessage("Password reset email sent if this email exists.");
    } catch (e) {
      setMessage("Error sending password reset email.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Forgot Password</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button className="btn btn-primary">Send Reset Link</button>
      </form>
    </div>
  );
}
