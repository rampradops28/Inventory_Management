import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import RoleRequest from "./pages/RoleRequest";
import AdminUsers from "./pages/AdminUsers";
import AdminRBAC from "./pages/AdminRBAC";
import CommanderPanel from "./pages/CommanderPanel";
import LogisticsPanel from "./pages/LogisticsPanel";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Hide Navbar on login / forgot / reset pages
function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/forgot-password", "/reset-password","/register"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container mt-4">{children}</div>
    </>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        {/* Redirect root to dashboard if logged in */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
        <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
        <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
        <Route path="/role-request" element={<ProtectedRoute><RoleRequest /></ProtectedRoute>} />

        {/* Admin-only Routes */}
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/rbac" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminRBAC /></ProtectedRoute>} />

        {/* Commander-only Routes */}
        <Route path="/commander" element={<ProtectedRoute allowedRoles={["Commander"]}><CommanderPanel /></ProtectedRoute>} />

        {/* Logistics-only Routes */}
        <Route path="/logistics" element={<ProtectedRoute allowedRoles={["LogisticsOfficer"]}><LogisticsPanel /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<div className="container mt-5"><h3>404 - Page not found</h3></div>} />
      </Routes>
    </Layout>
  );
}

export default App;
