"use client";

import ScrollFloat from "./ScrollFloat";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { UilBooks } from "@iconscout/react-unicons";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/ui/StarRating";

// Animation variants
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

interface Book {
  id: string;
  name: string;
  pages?: number;
  price: number;
  image?: string;
  description?: string;
  order?: number;
  category?: { name: string };
  rating?: number; // Added for star rating
}

const PriceTag: React.FC<{ price: string }> = ({ price }) => (
  <motion.div
    className="absolute top-4 right-4 z-30"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <div className="relative inline-flex items-center justify-center px-3 py-1 bg-indigo-200/80 dark:bg-indigo-900/80 rounded-lg shadow-md">
      <span className="text-base font-bold text-indigo-800 dark:text-indigo-100">
        {price}
      </span>
      <div className="absolute -left-2 w-0 h-0 border-t-[12px] border-t-transparent border-r-[12px] border-r-indigo-200/80 dark:border-r-indigo-900/80 border-b-[12px] border-b-transparent"></div>
    </div>
  </motion.div>
);

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartStatus, setCartStatus] = useState<{
    [id: string]: "idle" | "loading" | "success";
  }>({});
  const [cartItems, setCartItems] = useState<string[]>([]); // product ids in cart
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Error fetching products"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch cart items on mount
  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCartItems(data.map((item) => item.productId));
        }
      })
      .catch(() => {});
  }, []);

  // Sort books by 'order' field if present
  const sortedBooks = [...books].sort((a, b) => {
    if (typeof a.order === "number" && typeof b.order === "number") {
      return a.order - b.order;
    }
    return 0;
  });

  // Limit to 6 products only
  const displayedBooks = sortedBooks.slice(0, 6);

  // Add to Cart handler (send all required fields to API)
  const handleAddToCart = async (book: Book) => {
    if (cartStatus[book.id] === "loading" || cartItems.includes(book.id))
      return;
    setCartStatus((prev) => ({ ...prev, [book.id]: "loading" }));
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: book.id,
          name: book.name,
          image: book.image,
          price: book.price,
          category: book.category?.name,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add to cart");
      }
      setCartStatus((prev) => ({ ...prev, [book.id]: "success" }));
      setCartItems((prev) => [...prev, book.id]);
      toast({
        title: "Added to Cart!",
        description: `${book.name} has been added to your cart.`,
        status: "success",
      });
      // تحديث عدد المنتجات في الهيدر إذا كان هناك حدث مخصص
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(
        () => setCartStatus((prev) => ({ ...prev, [book.id]: "idle" })),
        2000
      );
    } catch (err) {
      setCartStatus((prev) => ({ ...prev, [book.id]: "idle" }));
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Could not add to cart.",
        status: "error",
      });
    }
  };

  return (
    <section className="bg-white dark:bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        {/* العنوان المتحرك */}
        <ScrollFloat speed={1.2}>Explore Our Featured Books</ScrollFloat>

        {/* وصف تسويقي جذاب */}
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-3 text-base sm:text-lg leading-relaxed">
          Discover beautifully crafted digital books that boost clarity, enhance
          your habits, and elevate your thinking — starting from{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            just $1
          </span>
          .
        </p>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-lg font-bold animate-pulse text-indigo-600 dark:text-indigo-300">
              Loading books...
            </span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-red-500 text-lg font-bold">{error}</span>
          </div>
        ) : books.length === 0 ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-gray-500 text-lg font-bold">
              No books found.
            </span>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:gap-8 lg:gap-12 mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {displayedBooks.map((book) => (
                <motion.div
                  key={book.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col h-full"
                >
                  {/* نجوم التقييم خارج الكرت مع خلفية جذابة */}
                  <motion.div
                    className="mb-2 flex items-center justify-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <span
                      className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-100 via-yellow-50 to-indigo-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-indigo-900 shadow-md border border-yellow-200/60 dark:border-zinc-700/60"
                      style={{ minWidth: 90 }}
                    >
                      <StarRating rating={book.rating ?? 4.5} />
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold text-base ml-1">
                        {(book.rating ?? 4.5).toFixed(1)}
                      </span>
                    </span>
                  </motion.div>
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
                              filter:
                                "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
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

                        <CardItem
                          translateZ="70"
                          className="w-full mt-6 flex-1"
                        >
                          <motion.div
                            className="relative overflow-hidden rounded-lg flex-1"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            <Link
                              href={`/menu/${book.id}`}
                              className="flex items-center gap-2 w-full h-full justify-center"
                            >
                              <Image
                                src={book.image || "/placeholder-book.jpg"}
                                alt={book.name}
                                width={700}
                                height={500}
                                className="w-full object-contain max-h-[200px] sm:max-h-[240px] lg:max-h-[280px] transition-all duration-300"
                                loading="lazy"
                              />
                            </Link>
                            <PriceTag
                              price={
                                typeof book.price === "number"
                                  ? `$${book.price.toFixed(2)}`
                                  : book.price || "$0.00"
                              }
                            />
                          </motion.div>
                          {book.description && (
                            <CardItem
                              as="p"
                              translateZ="40"
                              className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-2 min-h-[2.5em]"
                            >
                              {book.description
                                .split("\n")
                                .slice(0, 2)
                                .join(" ")}
                            </CardItem>
                          )}
                        </CardItem>
                      </div>
                      {/* Buttons container always at the bottom */}
                      <div className="mt-8 flex justify-between gap-4 z-20">
                        <motion.button
                          className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:bg-gray-400 disabled:cursor-not-allowed
                            border-transparent shadow-lg transition-all duration-200
                            relative overflow-hidden
                            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-teal-400 before:to-indigo-500 before:opacity-0 before:transition-opacity before:duration-300
                            hover:before:opacity-30
                            ${
                              cartStatus[book.id] === "success"
                                ? "bg-green-600 border-green-400 shadow-green-400/40"
                                : ""
                            }
                          `}
                          style={{ zIndex: 1 }}
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={async () => {
                            await handleAddToCart(book);
                          }}
                          disabled={
                            cartStatus[book.id] === "loading" ||
                            cartItems.includes(book.id)
                          }
                        >
                          {/* Loading Spinner */}
                          {cartStatus[book.id] === "loading" ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                          ) : cartStatus[book.id] === "success" ||
                            cartItems.includes(book.id) ? (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0.7 }}
                              animate={{ scale: [1.2, 1], opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                              }}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-5 h-5 text-white drop-shadow-[0_0_8px_#22c55e]" />
                              Added
                            </motion.span>
                          ) : (
                            <>
                              <motion.span
                                initial={false}
                                animate={{
                                  scale: [1, 1.15, 1],
                                  rotate: [0, -10, 0],
                                }}
                                transition={{ duration: 0.4 }}
                                className="flex items-center"
                              >
                                <FontAwesomeIcon
                                  icon={faCartShopping}
                                  className="w-5 h-5"
                                />
                              </motion.span>
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
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              className="w-5 h-5"
                            />
                            View Details
                          </Link>
                        </motion.button>
                      </div>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      {/* زر الانتقال إلى صفحة القائمة */}
      <div className="flex justify-center mt-12">
        <Link href="/menu">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg shadow-lg border border-indigo-800 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <UilBooks className="w-5 h-5" />
            View Full Menu
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
