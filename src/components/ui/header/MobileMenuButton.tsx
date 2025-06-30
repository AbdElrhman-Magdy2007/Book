"use client";

import React, { memo } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface MobileMenuButtonProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

/**
 * MobileMenuButton component renders a highly professional and visually stunning menu toggle button
 * with smooth animations, modern styling, subtle glow effects, and accessibility features.
 * Optimized for mobile and desktop with enhanced interactive effects.
 * @param {MobileMenuButtonProps} props - Component props
 * @returns {JSX.Element} Animated mobile menu toggle button with polished design
 */
const MobileMenuButton: React.FC<MobileMenuButtonProps> = memo(
  ({ isMobileMenuOpen, toggleMobileMenu }) => {
    // Animation variants for the button
    const buttonVariants = {
      rest: { scale: 1, rotate: 0, boxShadow: "0 0 0 rgba(0, 0, 0, 0)" },
      hover: {
        scale: 1.15,
        rotate: 10,
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", // Subtle blue glow
      },
      tap: { scale: 0.9, boxShadow: "0 2px 6px rgba(59, 130, 246, 0.2)" },
    };

    // Animation variants for the icon
    const iconVariants = {
      open: { rotate: 180, scale: 1.1, opacity: 0.9 },
      closed: { rotate: 0, scale: 1, opacity: 1 },
    };

    return (
      <motion.button
        onClick={toggleMobileMenu}
        className={clsx(
          "p-3 rounded-full transition-all duration-300 ease-in-out",
          "bg-gradient-to-r from-primary/15 to-primary/5",
          "hover:bg-primary/25 hover:shadow-xl",
          "active:bg-primary/35 active:shadow-md",
          "text-primary focus:outline-none focus:ring-4 focus:ring-primary/40 focus:ring-offset-2",
          "relative overflow-hidden",
          "ml-4"
        )}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        {/* Subtle glow overlay */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-30"
          transition={{ duration: 0.3 }}
        />
        <motion.div
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={iconVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {isMobileMenuOpen ? (
            <X size={28} aria-hidden="true" className="text-primary relative z-10" />
          ) : (
            <Menu size={28} aria-hidden="true" className="text-primary relative z-10" />
          )}
        </motion.div>
      </motion.button>
    );
  }
);

MobileMenuButton.displayName = "MobileMenuButton";

export default MobileMenuButton;