"use client";

import { Pages, Routes } from "@/constants/enums";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MenuItemsProps {
  products: Product[];
}

export default function MenuItems({ products: initialProducts }: MenuItemsProps) {
  const [products, setProducts] = useState(initialProducts);
  const [reorderLoading, setReorderLoading] = useState(false);

  const saveOrder = async (newProducts: Product[]) => {
    setReorderLoading(true);
    try {
      const order = newProducts.map((p, idx) => ({ id: p.id, order: idx + 1 }));
      const res = await fetch("/api/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      if (!res.ok) throw new Error("Failed to save order");
    } catch (err) {
      alert("Failed to save order");
    } finally {
      setReorderLoading(false);
    }
  };

  const moveProduct = (index: number, direction: "up" | "down") => {
    const newProducts = [...products];
    if (direction === "up" && index > 0) {
      [newProducts[index - 1], newProducts[index]] = [newProducts[index], newProducts[index - 1]];
    } else if (direction === "down" && index < newProducts.length - 1) {
      [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    }
    setProducts(newProducts);
    saveOrder(newProducts);
  };

  if (!products || !Array.isArray(products)) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow max-w-2xl mx-auto">
        <p className="text-lg font-medium text-red-600 dark:text-red-400">Error: Invalid products data</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow max-w-2xl mx-auto">
        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.map((product, idx) => (
          <li
            key={product.id}
            className="group relative bg-white dark:bg-zinc-950 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500"
          >
            {/* Order Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
              <button
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-1 shadow-md disabled:opacity-40"
                onClick={() => moveProduct(idx, "up")}
                disabled={idx === 0}
                title="Move up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-1 shadow-md disabled:opacity-40"
                onClick={() => moveProduct(idx, "down")}
                disabled={idx === products.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={`/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${product.id}/${Pages.EDIT}`}
              className="flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] mb-4 rounded-full overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 ring-2 ring-indigo-400/30">
                <Image
                  src={product.image || "/default-product-image.png"}
                  alt={product.name || "Product image"}
                  width={180}
                  height={180}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/placeholder-image.png"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-500 transition-colors truncate w-full max-w-full">
                {product.name}
              </h3>
              <span className="mt-2 text-sm font-medium text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {reorderLoading && (
        <div className="w-full flex justify-center mt-4">
          <span className="text-indigo-500 dark:text-indigo-400 text-sm font-medium animate-pulse">
            Saving order...
          </span>
        </div>
      )}
    </>
  );
}
