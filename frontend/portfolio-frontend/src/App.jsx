import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PortfolioViewPage from "./pages/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import PortfolioEditor from "./pages/PortfolioEditor";
import VerifyEmailPage from "./pages/VerifyEmail";
function App() {
  return (

    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            {/* Global Animated Background */}
            <div className="mesh-gradient-bg" />

            <Navbar />
            <main className="container mx-auto px-4 py-8 relative z-0">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/portfolio" element={<PortfolioViewPage />} />
                  <Route path="/editor" element={<PortfolioEditor />} />
                </Route>
                <Route path="/verify" element={<VerifyEmailPage />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>

  );
}

export default App;
