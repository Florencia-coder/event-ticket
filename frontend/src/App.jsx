import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FooterBottom from "./components/FooterBottom";
import ProtectedRoute from "./components/ProtectedRoute";
import FooterSocial from "./components/FooterSocial";

import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginOptions from "./pages/LoginOptions";
import LoginPassword from "./pages/LoginPassword";
import LoginOTP from "./pages/LoginOTP";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import EventDetail from "./pages/EventDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/options" element={<LoginOptions />} />
              <Route path="/login/password" element={<LoginPassword />} />
              <Route path="/login/otp" element={<LoginOTP />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <Tickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/events/:id" element={<EventDetail />} />
            </Routes>
          </div>
          <FooterBottom />
          <FooterSocial />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;