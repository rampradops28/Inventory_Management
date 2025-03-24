import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ui/theme-provider";

// pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forget_password from "./pages/Forget_password";
import Reset_password from "./pages/Reset_password";
import Verify_email from "./pages/Verify_email";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<Forget_password />} />
          <Route path="/reset-password" element={<Reset_password />} />
          <Route path="/verify-email" element={<Verify_email />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
