import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "react-hot-toast";

// pages import
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forget_password from "./pages/Forget_password";
import Reset_password from "./pages/Reset_password";
import Verify_email from "./pages/Verify_email";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BookDetails from "./pages/Book_details";
import BookCategory from "./pages/Book_category";
import BookView from "./pages/Book_view";

// app components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
    "/reset-password/:token",
    "*",
  ];

  const shouldHideNavbar = hideNavbarRoutes.some(
    (route) =>
      route === location.pathname ||
      (route.includes(":") && location.pathname.startsWith(route.split(":")[0]))
  );

  const hideFooterRoutes = [
    "/verify-email",
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
    "/reset-password/:token",
    "*",
  ];

  const shouldHideFooter = hideFooterRoutes.some(
    (route) =>
      route === location.pathname ||
      (route.includes(":") && location.pathname.startsWith(route.split(":")[0]))
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<Forget_password />} />
          <Route path="/reset-password/:token" element={<Reset_password />} />
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<Verify_email />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/book-category" element={<BookDetails />} />
          <Route
            path="/book-category/:categoryName"
            element={<BookCategory />}
          />
          <Route path="/book/:bookId" element={<BookView />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
