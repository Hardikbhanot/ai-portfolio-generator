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
      // Assuming 2-part TLD or 3-part? 
      // portfolio-generator.hbhanot.tech is the main domain (3 parts?)
      // If domain is "portfolio-generator.hbhanot.tech", parts are [portfolio-generator, hbhanot, tech] -> length 3.
      // If "hardik.portfolio-generator.hbhanot.tech", length 4.
      if (parts.length > 3) {
        sub = parts[0];
      } else if (parts.length === 3 && parts[1] === 'vercel') {
        // e.g. project.vercel.app -> sub = project? No, Vercel subdomains are main domains usually.
        // Custom domain logic is most important.
        // If the main domain is "custom.com", then "sub.custom.com" has 3 parts.
        // Let's assume anything NOT 'www' and NOT the known main domain is a sub.
        if (parts[0] !== 'www' && parts[0] !== 'app' && parts[0] !== 'ai-portfolio-generator') {
          // It's risky without knowing the exact main domain.
          // But for "portfolio-generator.hbhanot.tech", we expect sub.domain.
          if (host.endsWith('portfolio-generator.hbhanot.tech')) {
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
