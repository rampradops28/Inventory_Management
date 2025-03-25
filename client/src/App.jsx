import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
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
import CategoryBooks from "./pages/Book_category"; // Correct import

// app component
import Navbar from "./components/Navbar";

// Import the book1.png image
import book1Image from "./assets/images/book1.png";

const books = [
  {
    id: 1,
    category: 1,
    title: "Fiction Book 1",
    author: "Author 1",
    image: book1Image,
  },
  {
    id: 2,
    category: 1,
    title: "Fiction Book 2",
    author: "Author 2",
    image: book1Image,
  },
  {
    id: 3,
    category: 2,
    title: "Non-Fiction Book 1",
    author: "Author 3",
    image: "path/to/image3.jpg",
  },
  {
    id: 4,
    category: 3,
    title: "Science Book 1",
    author: "Author 4",
    image: "path/to/image4.jpg",
  },
  {
    id: 5,
    category: 4,
    title: "History Book 1",
    author: "Author 5",
    image: "path/to/image5.jpg",
  },
  {
    id: 6,
    category: 5,
    title: "Biography Book 1",
    author: "Author 6",
    image: "path/to/image6.jpg",
  },
  {
    id: 7,
    category: 6,
    title: "Fantasy Book 1",
    author: "Author 7",
    image: "path/to/image7.jpg",
  },
  {
    id: 8,
    category: 7,
    title: "Mystery Book 1",
    author: "Author 8",
    image: "path/to/image8.jpg",
  },
  {
    id: 9,
    category: 8,
    title: "Romance Book 1",
    author: "Author 9",
    image: "path/to/image9.jpg",
  },
];

const categories = [
  { id: 1, name: "Fiction", description: "Explore fictional books" },
  { id: 2, name: "Non-Fiction", description: "Explore non-fictional books" },
  { id: 3, name: "Science", description: "Explore science books" },
  { id: 4, name: "History", description: "Explore history books" },
  { id: 5, name: "Biography", description: "Explore biographies" },
  { id: 6, name: "Fantasy", description: "Explore fantasy books" },
  { id: 7, name: "Mystery", description: "Explore mystery books" },
  { id: 8, name: "Romance", description: "Explore romance books" },
];

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
        <Route
          path="/category/:categoryName"
          element={<CategoryBooks books={books} categories={categories} />}
        />
      </Routes>
    </>
  );
}

export default App;
