"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// نموذج بيانات المنتج في السلة
interface CartProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  category?: string;
  productId?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function fetchCart() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Error fetching cart");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
    // Listen for cart updates from other tabs/components
    function handleCartUpdate() {
      fetchCart();
    }
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart?id=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({
          title: "Removed",
          description: "Product removed from cart.",
          variant: "default",
        });
        fetchCart();
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Failed to remove product.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove product.",
        variant: "destructive",
      });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg font-bold animate-pulse text-indigo-600 dark:text-indigo-300">
          Loading...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-red-500 text-xl font-bold mb-4">{error}</span>
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
    <section className="mt-24 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-8 text-center tracking-tight">
        🛒 Shopping Cart
      </h1>
      {cart.length === 0 ? (
        <Card className="bg-card/80 dark:bg-card/60 border-0 shadow-xl flex flex-col items-center justify-center min-h-[40vh] text-center">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <span className="text-xl text-muted-foreground mb-4">
              Your cart is currently empty.
            </span>
            <Link
              href="/menu"
              className="text-indigo-600 hover:underline font-semibold"
            >
              ← Back to Menu
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <Card
              key={item.id}
              className="bg-card/80 dark:bg-card/60 border border-indigo-200/20 dark:border-indigo-700/40 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
                <div className="relative w-28 h-40 flex-shrink-0 rounded-xl overflow-hidden border border-indigo-100 dark:border-indigo-800 bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image
                    src={item.image || "/placeholder-book.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-grow gap-2 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-200 line-clamp-2">
                      {item.name}
                    </h2>
                    {item.category && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-bold text-green-500 text-lg">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 ml-auto">
                      Total: ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(item.productId || item.id)}
                      className="transition-all"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-card/90 dark:bg-card/70 border-0 shadow-xl mt-8">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
              <div className="text-xl font-bold text-indigo-700 dark:text-indigo-200">
                Grand Total: ${total.toFixed(2)}
              </div>
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
