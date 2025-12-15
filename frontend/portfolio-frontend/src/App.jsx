import React, { useState, useEffect } from "react";
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
import PublicPortfolioView from "./pages/PublicPortfolioView";

import LandingPage from "./pages/LandingPage";

function App() {
  const [subdomain, setSubdomain] = useState(null);

  useEffect(() => {
    const host = window.location.hostname;
    const parts = host.split('.');
    let sub = null;

    if (host.includes('localhost')) {
      if (parts.length > 1 && parts[0] !== 'www') {
        sub = parts[0];
      }
    } else {
      // Production: e.g. hardik.portfolio-generator.hbhanot.tech
      if (parts.length > 2) {
        // Assuming main domain is portfolio-generator.hbhanot.tech (3 parts)
        // or generic 2-part domain like google.com
        // We need to be careful. Let's assume anything that is NOT the main domain
        // includes a subdomain.

        // Hardcoded check for our known production domain
        if (host.endsWith('portfolio-generator.hbhanot.tech')) {
          if (parts.length > 3) { // sub.portfolio-generator.hbhanot.tech
            sub = parts[0];
          }
        } else {
          // For other domains (e.g. vercel.app), logic might vary.
          // Simplest generic approach: if length > 2, take first part.
          if (parts.length > 2 && parts[0] !== 'www') {
            sub = parts[0];
          }
        }
      }
    }

    setSubdomain(sub);
  }, []);

  if (subdomain) {
    return <PublicPortfolioView subdomain={subdomain} />;
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <MeshGradientBackground />
          <div className="relative z-10 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 pt-24 pb-20">
              <Routes>
                <Route path="/" element={<LandingPage />} />
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
