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
    <nav className="bg-white/30 dark:bg-gray-900/50 backdrop-blur-lg shadow-md fixed w-full z-10 top-0 left-0">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* 4. Corrected the link to point to /generate for logged-in users */}
        <Link to={isAuthenticated ? "/portfolio" : "/login"} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Lopsie Portfolio
        </Link>
        <div className="flex items-center space-x-6">
          {/* This part will now update instantly without a page refresh */}
          {isAuthenticated ? (
            <>
              <Link to="/portfolio" className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
                <FileTextIcon size={18} />
                Portfolio
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors">
                <LogOutIcon size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
              <LogInIcon size={18} />
              Login
            </Link>
          )}

          <button
            onClick={toggleDark}
            className="ml-4 px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;