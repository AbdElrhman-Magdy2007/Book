import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { getProductsByCategory } from "@/app/server/db/products";
import { debounce } from "lodash";

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  url?: string | null;
  category: {
    id: string;
    name: string;
  };
  ProductTech: { name: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  icon: string;
  products: Product[];
}

export interface UseBooksOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableNotifications?: boolean;
}

export interface UseBooksReturn {
  // Data
  books: Product[];
  categories: CategoryWithProducts[];
  filteredBooks: Product[];

  // State
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;

  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  refreshBooks: () => Promise<void>;
  retry: () => void;

  // Computed
  totalBooks: number;
  totalCategories: number;
  hasResults: boolean;
  isSearching: boolean;
}

// Constants
const CATEGORY_ICONS: Record<string, string> = {
  "Islamic Books": "🕌",
  "Educational Books": "📚",
  "Literary Books": "✍️",
  "Scientific Books": "🔬",
  "Historical Books": "📜",
  "Philosophical Books": "🤔",
  "Psychological Books": "🧠",
  "Economic Books": "💰",
  "Political Books": "🏛️",
  "Social Books": "👥",
  "Technical Books": "💻",
  "Medical Books": "🏥",
  "Legal Books": "⚖️",
  "Art Books": "🎨",
  "Sports Books": "⚽",
  "Travel Books": "✈️",
  "Cooking Books": "👨‍🍳",
  "Children Books": "👶",
  "Poetry Books": "📝",
  "Novel Books": "📖",
};

const DEFAULT_OPTIONS: UseBooksOptions = {
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
  enableNotifications: true,
};

export const useBooks = (options: UseBooksOptions = {}): UseBooksReturn => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // State
  const [books, setBooks] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch books function
  const fetchBooks = useCallback(
    async (showNotification = false) => {
      const now = Date.now();
      if (now - lastFetchRef.current < 10000) {
        // Prevent too frequent requests
        return;
      }

      try {
        // Abort previous request if still pending
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        const result = await getProductsByCategory();

        if (!Array.isArray(result)) {
          throw new Error("Invalid response from server");
        }

        const mappedCategories = [
          {
            id: "all",
            name: "All",
            icon: "📚",
            products: result.flatMap((cat) => cat.products || []),
          },
          ...result.map((category) => ({
            id: category.id,
            name: category.name,
            icon: CATEGORY_ICONS[category.name] || "📖",
            products: category.products || [],
          })),
        ];

        const allBooks = result.flatMap((cat) => cat.products || []);

        setCategories(mappedCategories);
        setBooks(allBooks);
        lastFetchRef.current = now;

        if (showNotification && opts.enableNotifications) {
          toast({
            title: "Books Updated",
            description: `Found ${allBooks.length} book(s)`,
            duration: 3000,
          });
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          return; // Request was aborted
        }

        console.error("Error loading books:", error);
        setError("Failed to load books. Please try again.");

        if (opts.enableNotifications) {
          toast({
            title: "Loading Error",
            description: "Failed to load books. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [opts.enableNotifications]
  );

  // Initial load
  useEffect(() => {
    fetchBooks(true);
  }, [fetchBooks]);

  // Auto refresh
  useEffect(() => {
    if (!opts.autoRefresh) return;

    intervalRef.current = setInterval(() => {
      fetchBooks(false);
    }, opts.refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [opts.autoRefresh, opts.refreshInterval, fetchBooks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Retry function
  const retry = useCallback(() => {
    fetchBooks(true);
  }, [fetchBooks]);

  // Filter books
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (book) => book.category.name === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.category.name.toLowerCase().includes(query) ||
          book.ProductTech.some((tech) =>
            tech.name.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [books, selectedCategory, searchQuery]);

  // Computed values
  const totalBooks = books.length;
  const totalCategories = categories.length;
  const hasResults = filteredBooks.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return {
    // Data
    books,
    categories,
    filteredBooks,

    // State
    isLoading,
    error,
    selectedCategory,
    searchQuery,

    // Actions
    setSelectedCategory,
    setSearchQuery: debouncedSearch,
    clearSearch,
    refreshBooks: () => fetchBooks(true),
    retry,

    // Computed
    totalBooks,
    totalCategories,
    hasResults,
    isSearching,
  };
};

// Utility functions
export const getBookStats = (books: Product[]) => {
  const stats = {
    total: books.length,
    free: books.filter((book) => book.price === 0).length,
    paid: books.filter((book) => book.price > 0).length,
    averageRating:
      books.reduce((sum, book) => sum + book.rating, 0) / books.length || 0,
    categories: new Set(books.map((book) => book.category.name)).size,
    technologies: new Set(
      books.flatMap((book) => book.ProductTech.map((tech) => tech.name))
    ).size,
  };

  return stats;
};

export const sortBooks = (
  books: Product[],
  sortBy: "name" | "rating" | "price" | "date" = "name",
  order: "asc" | "desc" = "asc"
) => {
  return [...books].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "price":
        comparison = a.price - b.price;
        break;
      case "date":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });
};

export const getBooksByRating = (books: Product[], minRating: number = 0) => {
  return books.filter((book) => book.rating >= minRating);
};

export const getBooksByPrice = (
  books: Product[],
  maxPrice: number = Infinity
) => {
  return books.filter((book) => book.price <= maxPrice);
};
