"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import Form from "./_components/Form";

// Fallback for the form
const FallbackForm = () => (
  <div className="text-center text-red-500 dark:text-red-400 p-4">
    Error: Form failed to load.
  </div>
);

// Particle background
const ParticleBackground = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 4,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 3,
    opacity: Math.random() * 0.4 + 0.3,
  }));

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.y}%`,
            left: `${p.x}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function SignInPage() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const createSparkle = (x: number, y: number) => {
    const id = Date.now();
    setSparkles((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 600);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black p-6 lg:pt-[90px]">
      <ParticleBackground />

      <motion.div
        className="z-10 w-full max-w-lg p-8 bg-indigo-800 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        role="region"
        aria-labelledby="signin-title"
      >
        <motion.h2
          id="signin-title"
          className="text-3xl sm:text-4xl font-bold text-center text-blue-400 mb-8 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Sign In
        </motion.h2>

        <motion.div
          className="min-h-[200px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {Form ? <Form /> : <FallbackForm />}
        </motion.div>

        <motion.p
          className="text-center text-sm text-white/60 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{" "}
          <span className="sparkle-container relative inline-block">
            <Link
              href={`/${Routes.AUTH}/${Pages.Register}`}
              className={`${buttonVariants({ variant: "link", size: "sm" })} text-purple-400 hover:underline relative group`}
              onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
              onClick={(e) => createSparkle(e.clientX, e.clientY)}
            >
              <span className="relative z-10">Create an Account</span>
              <span className="absolute inset-0 bg-purple-400/20 group-hover:opacity-50 transition-opacity duration-300 rounded-full" />
            </Link>
          </span>
        </motion.p>
      </motion.div>

      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-500 to-purple-500"
          style={{ width: 8, height: 8, top: s.y, left: s.x }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </main>
  );
}
