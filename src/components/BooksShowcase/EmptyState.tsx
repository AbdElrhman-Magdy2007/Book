"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter } from "lucide-react";

interface EmptyStateProps {
  searchQuery?: string;
  selectedCategory?: string;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, y: 20, rotate: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  selectedCategory,
  onClearSearch,
  onClearFilters,
}) => {
  const hasFilters =
    searchQuery || (selectedCategory && selectedCategory !== "All");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="col-span-full text-center py-16"
    >
      <motion.div variants={iconVariants} className="mb-6">
        {hasFilters ? (
          <Search className="h-16 w-16 text-gray-600 mx-auto" />
        ) : (
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto" />
        )}
      </motion.div>

      <motion.div variants={textVariants}>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          {hasFilters ? "No books found" : "No books available"}
        </h3>

        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {hasFilters
            ? "Try changing your search criteria or selected category"
            : "New books will be added soon. Check back later!"}
        </p>

        {hasFilters && (
          <div className="flex flex-wrap justify-center gap-3">
            {searchQuery && onClearSearch && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={onClearSearch}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-full transition-colors"
              >
                <Search className="h-4 w-4" />
                Clear Search
              </motion.button>
            )}

            {selectedCategory &&
              selectedCategory !== "All" &&
              onClearFilters && (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onClearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-full transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </motion.button>
              )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
