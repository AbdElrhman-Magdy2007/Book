"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { User, Shield } from "lucide-react";
import Logo from "./header/Logo";
import NavLinks from "./header/NavLinks";
import AuthSection from "./header/AuthSection";
import MobileMenuButton from "./header/MobileMenuButton";
import { useSession } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const Header: React.FC = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, handleClickOutside]);

  const { data: session } = useSession();

  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      { name: "Home", href: "/" },
      { name: "Menu", href: "/menu" },
      { name: "Showcase", href: "/showcase" },
    ];
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        items.push({
          name: "Admin",
          href: "/admin",
        });
      } else {
        items.push({
          name: "Profile",
          href: "/profile",
          icon: <User className="w-4 h-4 inline-block mr-1.5" />,
        });
      }
    }
    return items;
  }, [session]);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={clsx(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl",
        "bg-indigo-950/70 backdrop-blur-md border border-indigo-800/50",
        "rounded-full shadow-lg",
        "transition-all duration-300",
        isScrolled ? "py-0" : "py-0.5"
      )}
      role="banner"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto px-6 hidden md:grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <motion.div variants={childVariants} className="justify-self-start">
          <Logo />
        </motion.div>

        <motion.div variants={childVariants} className="justify-self-center">
          <NavLinks navItems={navItems} />
        </motion.div>

        <motion.div
          variants={childVariants}
          className="justify-self-end min-w-max"
        >
          <AuthSection onCloseMenu={toggleMobileMenu} />
        </motion.div>
      </div>

      <div className="md:hidden flex items-center justify-between px-6">
        <Logo />
        <MobileMenuButton
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
        />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            className={clsx(
              "text-center absolute top-16 inset-x-0 mx-auto w-[90%]",
              "bg-indigo-950/70 border border-white/10 backdrop-blur-xl",
              "rounded-xl py-4 px-6 flex flex-col gap-4 md:hidden"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <NavLinks
              navItems={navItems}
              isMobile={true}
              toggleMobileMenu={toggleMobileMenu}
            />
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <AuthSection onCloseMenu={toggleMobileMenu} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

Header.displayName = "Header";

export default Header;