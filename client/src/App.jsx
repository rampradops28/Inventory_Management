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
    <div className="flex flex-col min-h-screen dark:bg-gray-800 transition-colors duration-300">
      {!shouldHideNavbar && <Navbar />}
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
            element={!user ? <Forget_password /> : <Navigate to="/" replace />}
          />
          <Route
            path="/reset-password/:token"
            element={!user ? <Reset_password /> : <Navigate to="/" replace />}
          />

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<Verify_email />} />
          <Route path="/book-category" element={<BookDetails />} />
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

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
