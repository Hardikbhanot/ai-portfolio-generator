import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PortfolioViewPage from "./pages/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import PortfolioEditor from "./pages/PortfolioEditor";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import VerifyEmailPage from "./pages/VerifyEmail";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MeshGradientBackground from "./components/MeshGradientBackground";

function App() {
  return (

    <HelmetProvider>
      <AuthProvider>
        <Router>
          <MeshGradientBackground />
          <div className="relative z-10 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 pt-24 pb-20">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify" element={<VerifyEmailPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/portfolio" element={<PortfolioViewPage />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/editor" element={<PortfolioEditor />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>

  );
}

export default App;
