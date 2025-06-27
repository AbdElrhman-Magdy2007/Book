"use client";

import { motion } from "framer-motion";
import ScrollFloat from "./ScrollFloat"; // احذف GlitchText إذا لم تستخدمه فعلاً

const books = [
  {
    id: 1,
    title: "Deep Focus Mastery",
    pages: 120,
    price: "$6.99",
    image: "/books/focus.jpg",
  },
  {
    id: 2,
    title: "Build Better Habits",
    pages: 98,
    price: "$4.99",
    image: "/books/habits.jpg",
  },
  {
    id: 3,
    title: "Mindset Reset",
    pages: 130,
    price: "$7.99",
    image: "/books/mindset.jpg",
  },
];

export default function BooksSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">

        {/* العنوان المتحرك */}
        <ScrollFloat
          animationDuration={1}
          ease="back.out(1.7)"
          scrollStart="top 80%"
          scrollEnd="bottom 20%"
          stagger={0.03}
        >
          Explore Our Featured Books
        </ScrollFloat>

        {/* وصف تسويقي جذاب */}
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
          Discover beautifully crafted digital books that boost clarity, enhance your habits, and elevate your thinking —
          starting from&nbsp;
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            just $1
          </span>
          .
        </p>

        {/* البطاقات */}
        <div className="grid gap-10 mt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-56 object-cover sm:h-64 md:h-60"
              />
              <div className="p-6 text-left">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  {book.pages} pages &nbsp;•&nbsp; {book.price}
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300">
                  View Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
