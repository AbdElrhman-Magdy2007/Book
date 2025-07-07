'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import Form from './_components/Form';

// Fallback in case Form fails
const FallbackForm = () => (
  <div className="text-center text-red-500 dark:text-red-400 p-4">
    Error loading the form.
  </div>
);

// Background particles
const ParticleBackground = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 3,
    duration: Math.random() * 6 + 6,
    opacity: Math.random() * 0.3 + 0.4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/40 to-purple-400/40"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.y}%`,
            left: `${p.x}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function SignUpPage() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const createSparkle = (x: number, y: number) => {
    const id = Date.now();
    setSparkles((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 600);
  };

  return (
    <main
      className={clsx(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-black p-6 lg:pt-[90px]'
      )}
    >
      <ParticleBackground />

      <motion.div
      className={clsx(
        'z-10 w-full max-w-xl p-6 sm:p-10 bg-indigo-800 dark:bg-indigo-800',
        'backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl',
        'transition-transform duration-300 hover:scale-[1.02]'
      )}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        role="region"
        aria-labelledby="signup-title"
      >
        <motion.h1
          id="signup-title"
          className="text-4xl sm:text-5xl font-bold text-center text-blue-300 mb-8 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Create your account
        </motion.h1>

        <motion.div
          className="min-h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {Form ? <Form /> : <FallbackForm />}
        </motion.div>

        <motion.div
          className="mt-8 text-center text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Already have an account?{' '}
          <Link
            href={`/${Routes.AUTH}/${Pages.LOGIN}`}
            className={clsx(
              buttonVariants({ variant: 'link', size: 'sm' }),
              'text-blue-400 hover:underline relative group'
            )}
            onMouseEnter={(e) => createSparkle(e.clientX, e.clientY)}
            onClick={(e) => createSparkle(e.clientX, e.clientY)}
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 bg-blue-400/20 group-hover:opacity-50 transition-opacity duration-300 rounded-full" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
          style={{ width: 8, height: 8, top: s.y, left: s.x }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </main>
  );
}
