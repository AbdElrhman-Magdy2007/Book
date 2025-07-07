"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  isOnline?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  isOnline = true,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center bg-red-500/20 border border-red-500/30 rounded-lg p-6 mb-8"
    >
      <motion.div variants={iconVariants} className="mb-4">
        {isOnline ? (
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
        ) : (
          <WifiOff className="h-8 w-8 text-red-400 mx-auto" />
        )}
      </motion.div>

      <motion.div variants={textVariants}>
        <h3 className="text-red-300 text-lg font-semibold mb-2">
          {isOnline ? "Loading Error" : "No Internet Connection"}
        </h3>

        <p className="text-red-200 text-sm mb-4">{error}</p>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full hover:from-teal-500 hover:to-blue-600 transition-all duration-300 mx-auto"
          disabled={!isOnline}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </motion.button>

        {!isOnline && (
          <p className="text-red-200 text-xs mt-3">
            Check your internet connection and try again
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};
