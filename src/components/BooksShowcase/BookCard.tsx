"use client";

import React, { useState } from "react";
import { motion, AnimationOptions } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star, Download, Eye } from "lucide-react";
import { Product } from "@/hooks/useBooks";

interface BookCardProps {
  book: Product;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

export const BookCard: React.FC<BookCardProps> = ({ book, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = "/placeholder-book.jpg";

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-400"
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{
        type: "spring" as any,
        stiffness: 120,
        damping: 20,
        delay: (index || 0) * 0.1,
      }}
      className="group relative overflow-hidden rounded-xl border border-gray-200/20 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Card className="border-0 bg-transparent h-full flex flex-col">
        {/* Book Cover */}
        <div className="relative overflow-hidden">
          <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-800 to-gray-900">
            <img
              src={imageError ? defaultImage : book.image || defaultImage}
              alt={book.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          </div>

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="flex-1 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        aria-label="View book"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View book</p>
                    </TooltipContent>
                  </Tooltip>

                  {book.url && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex-1 bg-teal-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-teal-500 transition-colors flex items-center justify-center"
                          aria-label="Download book"
                        >
                          <Download className="h-4 w-4" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download book</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-grow">
          {/* Book Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
            {book.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {renderStars(book.rating)}
            <span className="text-sm text-gray-400 ml-1">
              ({book.rating.toFixed(1)})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
            {book.description}
          </p>

          {/* Technologies/Tags */}
          {book.ProductTech.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {book.ProductTech.slice(0, 3).map((tech) => (
                <Badge
                  key={tech.name}
                  variant="secondary"
                  className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors text-xs px-2 py-1"
                >
                  {tech.name}
                </Badge>
              ))}
              {book.ProductTech.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-gray-500/20 text-gray-300 text-xs px-2 py-1"
                >
                  +{book.ProductTech.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Price and Category */}
          <div className="flex items-center justify-between mt-auto">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
              {book.category.name}
            </Badge>
            <span
              className={`font-bold ${
                book.price === 0
                  ? "text-sm text-green-400"
                  : "text-lg text-green-400"
              }`}
            >
              {formatPrice(book.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
