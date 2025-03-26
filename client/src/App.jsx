import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";

// pages import
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/Forget_password";
import ResetPassword from "./pages/Reset_password";
import VerifyEmail from "./pages/Verify_email";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import BookDetails from "./pages/Book_details";
import BookCategory from "./pages/Book_category";
import BookView from "./pages/Book_view";

// app components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

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
  const { user } = useUserStore();

  const hideNavbarFooterRoutes = [
    "/verify-email",
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
  ];

  const shouldHideNavbarFooter = hideNavbarFooterRoutes.some(
    (route) =>
      route === location.pathname ||
      (route.includes(":") && location.pathname.startsWith(route.split(":")[0]))
  );

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-800 transition-colors duration-300">
      {!shouldHideNavbarFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Authentication Routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/" replace />}
          />
          <Route
            path="/forget-password"
            element={!user ? <ForgetPassword /> : <Navigate to="/" replace />}
          />
          <Route
            path="/reset-password/:token"
            element={!user ? <ResetPassword /> : <Navigate to="/" replace />}
          />

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/book-details" element={<BookDetails />} />
          <Route
            path="/book-category/:categoryName"
            element={<BookCategory />}
          />
          <Route path="/book/:bookId" element={<BookView />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              user?.role === "admin" ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <h1 className="text-center text-2xl text-red-500">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>
      {!shouldHideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
