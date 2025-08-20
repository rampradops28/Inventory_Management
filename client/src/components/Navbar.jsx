import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/">Military Assets</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {user && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/assets">Assets</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/purchases">Purchases</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/transfers">Transfers</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/assignments">Assignments</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/role-request">Role Request</Link></li>
              {user.role === "Admin" && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/admin/users">Admin: Users</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/rbac">Admin: Role Requests</Link></li>
                </>
              )}
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <span className="navbar-text text-light me-3">
                Hi, <strong>{user.name}</strong> ({user.role})
              </span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link className="btn btn-success btn-sm" to="/login">Login</Link>
              </li>
              <li className="nav-item me-2">
                <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-warning btn-sm" to="/forgot-password">Forgot Password</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
