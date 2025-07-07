"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  description: string;
  rating: number;
  url?: string;
  category?: string;
  ProductTech?: { name: string }[];
  beneficiary?: string;
  pages?: number;
}

// ⭐ Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927a1 1 0 011.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.97 0 1.372 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.784-.57-.381-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
      {halfStar && (
        <svg
          className="w-5 h-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            d="M9.049 2.927a1 1 0 011.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.97 0 1.372 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.784-.57-.381-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
          />
        </svg>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927a1 1 0 011.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.97 0 1.372 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.784-.57-.381-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
      <span className="ml-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg font-bold animate-pulse text-indigo-600 dark:text-indigo-300">
          Loading...
        </span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-red-500 text-xl font-bold mb-4">
          {error || "Product not found"}
        </span>
        <Link
          href="/menu"
          className="text-indigo-600 hover:underline font-semibold"
        >
          ← Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-24 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-10 items-center"
      >
        {/* Left - Book Image */}
        <div className="w-full flex justify-center">
          <Image
            src={product.image || "/placeholder-book.jpg"}
            alt={product.name}
            width={600}
            height={800}
            className="rounded-3xl shadow-xl object-cover border border-indigo-300 dark:border-indigo-700 w-full max-w-[500px] max-h-[700px]"
            priority
          />
        </div>

        {/* Right - Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-300">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <StarRating rating={product.rating} />
            {product.category && (
              <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                {product.category}
              </span>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {product.description}
          </p>

          {product.beneficiary && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                Beneficiary:
              </span>{" "}
              {product.beneficiary}
            </p>
          )}

          {product.ProductTech && product.ProductTech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.ProductTech.map((tech) => (
                <span
                  key={tech.name}
                  className="bg-indigo-100 dark:bg-indigo-800/50 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-200">
              {product.price === 0 ? "Free" : `$${product.price.toFixed(2)}`}
            </span>
            {typeof product.pages === "number" && (
              <span className="flex items-center gap-1 text-base text-gray-500 dark:text-gray-400 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full font-medium shadow-sm">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5v-15A2.5 2.5 0 0017.5 2h-11A2.5 2.5 0 004 4.5v15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 6h8M8 10h8M8 14h6"
                  />
                </svg>
                {product.pages} pages
              </span>
            )}

            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                <span className="tracking-wide">Download Book</span>
              </a>
            )}
          </div>

          <Link
            href="/menu"
            className="mt-6 text-indigo-600 hover:underline font-semibold"
          >
            ← Back to Menu
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
