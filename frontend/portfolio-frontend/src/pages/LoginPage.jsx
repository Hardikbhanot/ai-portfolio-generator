import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
// 1. IMPORT the configured apiClient
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import UserForm from "../components/UserForm";
import Notification from "../components/Notification";
import SEO from "../components/SEO";
import { LogIn as LogInIcon } from "lucide-react";

function LoginPage() {
  const [view, setView] = useState("login");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 2. USE the apiClient for the API call. It will use the correct base URL.
      const response = await apiClient.post("/api/auth/login", loginForm);
      const { token } = response.data;

      login(token);

      setNotification({
        type: "success",
        message: "Login successful! Redirecting...",
      });

      // 3. CORRECTED the redirect path to the protected route
      setTimeout(() => {
        navigate("/portfolio");
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid email or password.";
      setNotification({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
  const buttonClasses = "relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg group hover:bg-white hover:text-indigo-600 w-full disabled:bg-indigo-400";

  return (
    <>
      <SEO
        title={view === "login" ? "Login" : "Register"}
        description="Access your dashboard to create and manage your AI-generated portfolio."
      />
      <Notification notification={notification} setNotification={setNotification} />
      <div className="flex justify-center items-center min-h-[80vh] p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-card rounded-2xl p-8 w-full max-w-md sm:p-10"
        >
          <div className="flex justify-center gap-2 mb-8 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl">
            <button
              onClick={() => setView("login")}
              className={`flex-1 py-2 font-medium rounded-lg transition-all duration-300 ${view === "login" ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              Log In
            </button>
            <button
              onClick={() => setView("register")}
              className={`flex-1 py-2 font-medium rounded-lg transition-all duration-300 ${view === "register" ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.div key="login-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Welcome Back</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue building</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
                    <input name="email" type="email" placeholder="Enter your email" onChange={handleLoginChange} className={inputClasses} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
                    <input name="password" type="password" placeholder="Enter your password" onChange={handleLoginChange} className={inputClasses} required />
                  </div>
                  <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                      <LogInIcon className="w-5 h-5" />
                      {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="register-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Start Building</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Create your account in seconds</p>
                </div>
                <UserForm
                  setNotification={setNotification}
                  onSuccess={() => setView('login')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

export default LoginPage;

