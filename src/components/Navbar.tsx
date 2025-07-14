"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "cart", href: "/cart" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl bg-indigo-950/70 backdrop-blur-md border border-indigo-800 px-6 py-3 rounded-full shadow-lg flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={28} height={28} />
        <span className="text-indigo-100 font-semibold text-sm tracking-wider">
          Inkspire
        </span>
      </Link>

      {/* Center: Links (hidden on mobile) */}
      <ul className="hidden md:flex gap-6 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-indigo-300 hover:text-white",
                  "flex items-center gap-1"
                )}
              >
                {isActive && <span className="text-white text-lg">•</span>}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right: Auth buttons (hidden on mobile) */}
      <div className="hidden md:flex gap-2 items-center">
        <Link
          href="/login"
          className="text-sm text-indigo-300 hover:text-white transition px-3 py-1.5 rounded-md"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="text-sm text-white bg-indigo-700 hover:bg-indigo-600 transition px-4 py-1.5 rounded-md border border-indigo-600"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-indigo-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="text-center absolute top-16 inset-x-0 mx-auto w-[90%] bg-indigo-950/70 border border-white/10 backdrop-blur-xl rounded-xl py-4 px-6 flex flex-col gap-4 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "text-white text-sm font-medium py-1",
                  pathname === item.href ? "underline underline-offset-4" : ""
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md border border-white/20 text-center"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
