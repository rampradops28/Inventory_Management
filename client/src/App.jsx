import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "react-hot-toast";

// pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forget_password from "./pages/Forget_password";
import Reset_password from "./pages/Reset_password";
import Verify_email from "./pages/Verify_email";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BookDetails from "./pages/Book_details";
import BookCategory from "./pages/Book_category"; // Corrected import
import BookView from "./pages/Book_view"; // Corrected import

// app component
import Navbar from "./components/Navbar";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/verify-email",
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
    "/dashboard",
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<Forget_password />} />
        <Route path="/reset-password" element={<Reset_password />} />
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<Verify_email />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-details" element={<BookDetails />} />
        <Route path="/book-category/:categoryName" element={<BookCategory />} />
        <Route path="/book/:bookId" element={<BookView />} />
      </Routes>
    </>
  );
}

export default App;
