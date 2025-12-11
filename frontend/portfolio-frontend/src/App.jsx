import React from "react";
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
    
    <Router>
     < AuthProvider>
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-gray-900 dark:text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-10">
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
    
  );
}

export default App;
