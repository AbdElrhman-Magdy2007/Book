"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  quote: string;
  title: string;
}

interface InfiniteMovingCardsProps {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const controls = useAnimation();
  const [start, setStart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const applyDirection = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  }, [direction]);

  const applySpeed = useCallback(() => {
    if (containerRef.current) {
      const speeds = {
        fast: "20s",
        normal: "40s",
        slow: "80s",
      };
      containerRef.current.style.setProperty(
        "--animation-duration",
        speeds[speed]
      );
    }
  }, [speed]);

  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current!.appendChild(duplicatedItem);
      });

      applyDirection();
      applySpeed();
      setStart(true);
    }
  }, [applyDirection, applySpeed]);

  useEffect(() => {
    addAnimation();
    return () => {
      controls.stop();
    };
  }, [addAnimation, controls]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
      controls.start({
        x: direction === "left" ? "-100%" : "0%",
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed === "fast" ? 20 : speed === "normal" ? 40 : 80,
            ease: "linear",
          },
        },
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full max-w-7xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 sm:gap-6 py-6",
          start && !isHovered && "animate-scroll"
        )}
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={controls}
      >
        {items.map((item, idx) => (
          <motion.li
            key={`${item.name}-${idx}`}
            className="relative w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] shrink-0 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white px-6 py-8 sm:px-8 shadow-lg hover:shadow-2xl transition-all duration-300 dark:from-[#1e1b4b] dark:to-[#312e81] dark:border-indigo-700"
            whileHover={{ scale: 1.04, zIndex: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-30 dark:from-indigo-800 dark:to-indigo-700 transition-opacity duration-300 hover:opacity-50"
              />
              <span className="relative z-10 block text-sm sm:text-base leading-relaxed font-medium text-gray-900 dark:text-indigo-400 tracking-tight">
                {item.quote}
              </span>
              <div className="relative z-10 mt-6 flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.title}
                  </span>
                </div>
              </div>
            </blockquote>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};