import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // <-- 1. UPDATE ahe import path
import { LogIn as LogInIcon, FileText as FileTextIcon, LogOut as LogOutIcon } from 'lucide-react';

function Navbar() {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const { isAuthenticated, logout } = useAuth(); // <-- 2. Get state AND logout function from context
  const navigate = useNavigate();

  const toggleDark = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    // 3. THIS IS THE KEY CHANGE.
    // Call the logout function from the context. It handles removing the token
    // and updating the global state. The page refresh is no longer needed.
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card sticky top-4 left-0 right-0 mx-4 rounded-2xl z-50 mb-8 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* 4. Corrected the link to point to /generate for logged-in users */}
        <Link to={isAuthenticated ? "/portfolio" : "/login"} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 hover:scale-105 transition-transform">
          Lopsie
        </Link>
        <div className="flex items-center space-x-4">
          {/* This part will now update instantly without a page refresh */}
          {isAuthenticated ? (
            <>
              <Link to="/portfolio" className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
                <FileTextIcon size={18} />
                <span className="hidden sm:inline">Portfolio</span>
              </Link>
              <button onClick={handleLogout} className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOutIcon size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary flex items-center gap-2">
              <LogInIcon size={18} />
              Login
            </Link>
          )}

          <button
            onClick={toggleDark}
            className="glass-button p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:rotate-12"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;