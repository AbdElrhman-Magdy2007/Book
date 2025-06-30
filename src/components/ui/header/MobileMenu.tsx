"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { X } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  navItems: NavItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  navItems,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      toggleMobileMenu();
    }
  }, [toggleMobileMenu]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [isMobileMenuOpen, toggleMobileMenu]);

  const handleNavigation = useCallback((href: string) => {
    router.push(href);
    toggleMobileMenu();
  }, [router, toggleMobileMenu]);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, handleClickOutside, handleKeyDown]);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          ref={menuRef}
          className="text-center fixed top-16 inset-x-0 mx-auto w-[90%] max-w-md bg-indigo-950/70 border border-white/10 backdrop-blur-xl rounded-xl py-5 px-6 flex flex-col gap-5 md:hidden z-[60] shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavigation(item.href)}
              className={clsx(
                "text-sm font-medium py-1 transition-all duration-200",
                pathname === item.href
                  ? "text-white underline underline-offset-4"
                  : "text-indigo-200 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            {status === "loading" ? (
              <span className="text-sm text-gray-300">Loading...</span>
            ) : session?.user ? (
              <button
                onClick={handleSignOut}
                className="text-sm text-white bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md border border-red-700 text-center font-medium"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => handleNavigation("/login")}
                  className="text-sm text-indigo-200 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => handleNavigation("/signup")}
                  className="text-sm text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md border border-indigo-700 text-center font-medium shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;