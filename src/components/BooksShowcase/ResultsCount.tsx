"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter } from "lucide-react";

interface ResultsCountProps {
  totalBooks: number;
  filteredBooks: number;
  searchQuery?: string;
  selectedCategory?: string;
  isSearching?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

export const ResultsCount: React.FC<ResultsCountProps> = ({
  totalBooks,
  filteredBooks,
  searchQuery,
  selectedCategory,
  isSearching = false,
}) => {
  const hasFilters =
    searchQuery || (selectedCategory && selectedCategory !== "All");
  const isFiltered = filteredBooks !== totalBooks;

  if (!hasFilters && !isFiltered) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center text-gray-400 mb-8"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        {searchQuery ? (
          <motion.div variants={iconVariants}>
            <Search className="h-5 w-5 text-purple-400" />
          </motion.div>
        ) : selectedCategory && selectedCategory !== "All" ? (
          <motion.div variants={iconVariants}>
            <Filter className="h-5 w-5 text-blue-400" />
          </motion.div>
        ) : (
          <motion.div variants={iconVariants}>
            <BookOpen className="h-5 w-5 text-teal-400" />
          </motion.div>
        )}

        <span className="text-lg font-medium">
          Found <span className="text-teal-400 font-bold">{filteredBooks}</span>{" "}
          book(s)
        </span>
      </div>

      {(searchQuery || selectedCategory) && (
        <div className="text-sm text-gray-500">
          {searchQuery && (
            <span>
              for "
              <span className="text-purple-400 font-semibold">
                {searchQuery}
              </span>
              "
            </span>
          )}

          {searchQuery && selectedCategory && selectedCategory !== "All" && (
            <span> and</span>
          )}

          {selectedCategory && selectedCategory !== "All" && (
            <span>
              in category{" "}
              <span className="text-blue-400 font-semibold">
                {selectedCategory}
              </span>
            </span>
          )}

          {isFiltered && (
            <span>
              {" "}
              out of{" "}
              <span className="text-gray-400 font-semibold">
                {totalBooks}
              </span>{" "}
              books
            </span>
          )}
        </div>
      )}

      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 mt-2"
        >
          Searching...
        </motion.div>
      )}
    </motion.div>
  );
};
