"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import ScrollFloat from "@/components/FeaturedBooks/ScrollFloat";
import {
  EmptyState,
  ErrorState,
  ResultsCount,
  SearchAndFilters,
} from "@/components/BooksShowcase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

// PriceTag component
const PriceTag: React.FC<{ price: number }> = ({ price }) => {
  return (
    <motion.div
      className="absolute top-4 right-4 z-30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className="relative inline-flex items-center justify-center px-3 py-1 bg-indigo-200/80 dark:bg-indigo-900/80 rounded-lg shadow-md">
        <span className="text-base font-bold text-indigo-800 dark:text-indigo-100">
          £{price.toFixed(2)}
        </span>
        <div className="absolute -left-2 w-0 h-0 border-t-[12px] border-t-transparent border-r-[12px] border-r-indigo-200/80 dark:border-r-indigo-900/80 border-b-[12px] border-b-transparent"></div>
      </div>
    </motion.div>
  );
};

// Animation variants for smooth transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { stiffness: 120, damping: 20 },
  },
  hover: {
    y: -8,
    scale: 1.03,
    transition: { duration: 0.3, ease: easeOut },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const skeletonItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <motion.div
    variants={skeletonVariants}
    initial="hidden"
    animate="visible"
    className="grid gap-6 sm:gap-8 lg:gap-12 mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <motion.div
        key={index}
        variants={skeletonItemVariants}
        className="bg-white dark:bg-zinc-900/90 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-5 sm:p-6 shadow-md"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 sm:h-72 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mt-4"></div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Professional book card component with refined buttons
const BookCard: React.FC<{ book: any; index: number }> = ({ book, index }) => {
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const defaultImage = "/placeholder-book.jpg";

  // Check if already in cart on mount
  React.useEffect(() => {
    let isMounted = true;
    async function checkIfAdded() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) return;
        const items = await res.json();
        if (
          isMounted &&
          Array.isArray(items) &&
          items.some((item) => item.productId === book.id)
        ) {
          setAdded(true);
        }
      } catch {}
    }
    checkIfAdded();
    return () => {
      isMounted = false;
    };
  }, [book.id]);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg
            key={"full-" + i}
            className="w-5 h-5 text-yellow-400 drop-shadow-sm"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
        {halfStar && (
          <svg
            className="w-5 h-5 text-yellow-400 drop-shadow-sm"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
              fill="url(#half)"
            />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg
            key={"empty-" + i}
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleImageError = () => setImageError(true);

  async function handleAddToCart() {
    if (adding || added) return;
    setAdding(true);
    try {
      // Validate productId
      if (!book.id) {
        toast({
          title: "Error",
          description: "Product ID is missing.",
          variant: "destructive",
        });
        setAdding(false);
        return;
      }
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: book.id,
          name: book.name,
          image: book.image,
          price: book.price,
          category:
            typeof book.category === "object" && book.category !== null
              ? book.category.name
              : book.category,
        }),
      });
      if (res.status === 201) {
        toast({
          title: "Added to Cart",
          description: `${book.name} has been added to your cart!`,
          variant: "default",
        });
        setAdded(true);
        window.dispatchEvent(new Event("cart-updated"));
      } else if (res.status === 409) {
        toast({
          title: "Already in Cart",
          description: "This product is already in your cart.",
          variant: "default",
        });
        setAdded(true);
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Failed to add to cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="relative group">
      {/* Stars at the top */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-20 flex items-center bg-white/90 dark:bg-zinc-900/90 px-3 py-1 rounded-full shadow backdrop-blur border border-gray-200 dark:border-zinc-700">
        {renderStars(book.rating)}
        <span className="ml-2 text-xs font-bold text-yellow-600">
          {book.rating.toFixed(1)}
        </span>
      </div>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        custom={index}
        className="flex flex-col h-full"
      >
        <CardContainer
          className="inter-var flex-1"
          containerClassName="hover:scale-[1.04] transition-transform duration-500 ease-out w-full max-w-sm mx-auto"
        >
          <CardBody className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-zinc-900/90 dark:via-zinc-800/90 dark:to-zinc-900/90 border border-gray-200/50 dark:border-zinc-700/50 w-full rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 backdrop-blur-sm min-h-[480px] flex-1">
            <div className="flex-1">
              <CardItem translateZ="60" className="relative z-10">
                <motion.div
                  className="text-xl sm:text-2xl font-extrabold tracking-wide line-clamp-2"
                  style={{
                    color: "#4B5EAA",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                  }}
                  whileHover={{
                    scale: 1.03,
                    textShadow: "0 0 10px rgba(75, 94, 170, 0.5)",
                    transition: { duration: 0.3 },
                  }}
                >
                  {book.name}
                </motion.div>
              </CardItem>

              <CardItem translateZ="70" className="w-full mt-6 flex-1">
                <motion.div
                  className="relative overflow-hidden rounded-lg flex-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <Link href={`/menu/${book.id}`} className="block w-full">
                    <Image
                      src={
                        imageError ? defaultImage : book.image || defaultImage
                      }
                      alt={`${book.name} cover`}
                      width={700}
                      height={500}
                      className="w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain shadow transition-all duration-300"
                      priority={index < 3}
                      onError={handleImageError}
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  </Link>
                  <PriceTag price={book.price} />
                </motion.div>
                {/* Show first two lines of description under the image */}
                {book.description && (
                  <div className="mt-3 text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-[2.5em] flex-1">
                    {book.description.split("\n").slice(0, 2).join(" ")}
                  </div>
                )}
              </CardItem>
            </div>
            {/* Buttons container always at the bottom */}
            <div className="mt-8 flex justify-between gap-4 z-20">
              <motion.button
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-xl border border-indigo-800 shadow-lg hover:shadow-[0_8px_16px_rgba(79,70,229,0.3)] hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={adding || added}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-white drop-shadow-[0_0_8px_#22c55e] mr-2" />
                    Added
                  </>
                ) : adding ? (
                  "Adding..."
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCartShopping} className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
              <motion.button
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-zinc-700 text-indigo-800 dark:text-indigo-100 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 shadow-lg hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all duration-200 font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/menu/${book.id}`}
                  className="flex items-center gap-2 w-full h-full justify-center"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
                  View Details
                </Link>
              </motion.button>
            </div>
          </CardBody>
        </CardContainer>
      </motion.div>
    </div>
  );
};

// Main component
const BooksShowcase: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");

  const {
    books,
    categories,
    filteredBooks,
    isLoading,
    error,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    clearSearch,
    retry,
    totalBooks,
    hasResults,
    isSearching,
  } = useBooks({
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    enableNotifications: true,
  });

  // Memoized handlers for better performance
  const handleSearchChange = useMemo(
    () => (query: string) => {
      setSearchInput(query);
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const handleClearSearch = useMemo(
    () => () => {
      setSearchInput("");
      clearSearch();
    },
    [clearSearch]
  );

  const handleClearFilters = useMemo(
    () => () => {
      setSelectedCategory("All");
    },
    [setSelectedCategory]
  );

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-white dark:bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ScrollFloat speed={1.2}>Loading Digital Library...</ScrollFloat>

            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mt-3 text-sm sm:text-base leading-relaxed">
              Please wait while we fetch your digital library collection.
            </p>
          </motion.div>

          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section className="bg-white dark:bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <ScrollFloat speed={1.2}>Explore Our Digital Library</ScrollFloat>

          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-3 text-base sm:text-lg leading-relaxed">
            Discover beautifully crafted digital books that boost clarity,
            enhance your habits, and elevate your thinking — starting from{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              just $1
            </span>
            .
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <SearchAndFilters
            searchQuery={searchInput}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categories={categories}
          />
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <ErrorState
                error={error}
                onRetry={retry}
                isOnline={navigator.onLine}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ResultsCount
            totalBooks={totalBooks}
            filteredBooks={filteredBooks.length}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            isSearching={isSearching}
          />
        </motion.div>

        {/* Books Card */}
        <motion.div
          variants={containerVariants}
          className="grid gap-6 sm:gap-8 lg:gap-12 mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="wait">
            {hasResults ? (
              filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="col-span-full"
              >
                <EmptyState
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  onClearSearch={handleClearSearch}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BooksShowcase;
