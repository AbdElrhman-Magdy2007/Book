"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BookCardSkeletonProps {
  index?: number;
}

const skeletonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: "easeOut",
    },
  }),
};

export const BookCardSkeleton: React.FC<BookCardSkeletonProps> = ({
  index = 0,
}) => {
  return (
    <motion.div
      variants={skeletonVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      className="overflow-hidden rounded-xl border border-gray-200/20 bg-white/5 backdrop-blur-sm shadow-lg"
    >
      {/* Book Cover Skeleton */}
      <Skeleton className="aspect-[3/4] w-full bg-gray-800/50" />

      <div className="p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 bg-gray-800/50 mb-2" />

        {/* Rating Skeleton */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 bg-gray-800/50 rounded" />
          ))}
          <Skeleton className="h-4 w-8 bg-gray-800/50 rounded ml-1" />
        </div>

        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full bg-gray-800/50 mb-2" />
        <Skeleton className="h-4 w-2/3 bg-gray-800/50 mb-4" />

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-5 w-16 bg-teal-500/30 rounded-full" />
          <Skeleton className="h-5 w-16 bg-teal-500/30 rounded-full" />
          <Skeleton className="h-5 w-16 bg-teal-500/30 rounded-full" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20 bg-gray-800/50 rounded" />
          <Skeleton className="h-5 w-16 bg-gray-800/50 rounded" />
        </div>
      </div>
    </motion.div>
  );
};

export const BooksGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
};
