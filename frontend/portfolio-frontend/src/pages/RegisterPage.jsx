import React from "react";
import { motion } from "framer-motion";
import UserForm from "../components/UserForm";

function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/40 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm sm:p-10"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Create an Account
        </h2>
        <UserForm />
      </motion.div>
    </div>
  );
}

export default RegisterPage;