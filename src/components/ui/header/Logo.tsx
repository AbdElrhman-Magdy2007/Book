import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  const logoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <Link href="/" style={{ textDecoration: "none" }}>
      <motion.div
        className="flex items-center gap-3 group"
        variants={logoVariants}
      >
      <h1 className="flex items-center md:text-3xl text-xl font-extrabold font-heading tracking-tight select-none">
        <img
          src="https://i.postimg.cc/YS96n7FT/Chat-GPT-Image-Jul-11-2025-03-55-44-PM.png"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg border-2 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl object-cover bg-indigo-600"
          alt="Inkspire Logo"
        />
        <span className="ml-2 flex items-center space-x-1">
        {["I", "n", "k", "s", "p", "i", "r", "e"].map((letter, index) => (
          <motion.span
            key={`name-${index}`}
            className="text-primary animate-glow"
            variants={letterVariants}
          >
            {letter}
          </motion.span>
        ))}
        </span>
      </h1>
    </motion.div>
    </Link>
  );
};

export default Logo;
