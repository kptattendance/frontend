"use client";
import { motion } from "framer-motion";

export default function LoaderOverlay({ message }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white/90 dark:bg-gray-900/90 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-gray-200/30"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        {/* Spinner */}
        <div className="relative">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-14 h-14 border-4 border-blue-300 border-t-transparent rounded-full animate-pulse opacity-40"></div>
        </div>

        {/* Message */}
        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium tracking-wide text-center">
          {message}
        </p>
      </motion.div>
    </motion.div>
  );
}
