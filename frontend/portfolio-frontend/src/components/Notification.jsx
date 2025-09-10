import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 as CheckIcon, AlertTriangle as AlertIcon, X as XIcon } from "lucide-react";

const Notification = ({ notification, setNotification }) => {
  if (!notification) return null;

  const { type, message } = notification;
  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setNotification(null)}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md p-6 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setNotification(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <XIcon size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            {isSuccess ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                <CheckIcon className="w-16 h-16 text-green-500" />
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                <AlertIcon className="w-16 h-16 text-red-500" />
              </motion.div>
            )}
            <p className={`mt-4 text-lg font-medium text-gray-800 dark:text-gray-100`}>
              {isSuccess ? "Success!" : "Oops!"}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;