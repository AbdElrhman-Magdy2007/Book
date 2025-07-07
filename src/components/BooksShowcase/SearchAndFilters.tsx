"use client";

import React, { useRef, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { CategoryWithProducts } from "@/hooks/useBooks";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: CategoryWithProducts[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOut,
      delay: index * 0.05,
    },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 },
};

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedCategory,
  onCategorySelect,
  categories,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        searchInputRef.current &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      {/* Search Bar */}
      <motion.div
        variants={itemVariants}
        custom={0}
        className="relative max-w-md mx-auto mb-8"
      >
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search books by name, tech, or type (press /)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-12 py-3 w-full bg-gray-800/20 border-indigo-800 focus:border-indigo-400 rounded-lg text-gray-300 placeholder-gray-400"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Category Filters */}
      <motion.div
        variants={itemVariants}
        custom={1}
        className="flex flex-wrap justify-center gap-3"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onCategorySelect(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === category.name
                ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg"
                : "bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 hover:text-white"
            }`}
            aria-pressed={selectedCategory === category.name}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
            <Badge
              variant="secondary"
              className={`text-xs ${
                selectedCategory === category.name
                  ? "bg-white/20 text-white"
                  : "bg-gray-600/50 text-gray-300"
              }`}
            >
              {category.products.length}
            </Badge>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};
