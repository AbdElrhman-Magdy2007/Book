"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

type HoverBorderGradientProps<T extends React.ElementType> = {
  as?: T;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  children?: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  glowIntensity?: number;
} & React.ComponentPropsWithoutRef<T>;

export const HoverBorderGradient = <T extends React.ElementType = "button">({
  children,
  containerClassName,
  className,
  as,
  duration = 1,
  clockwise = true,
  primaryColor = "#4c51bf", // إنديجو داكن
  secondaryColor = "#7f9cf5", // إنديجو فاتح
  glowIntensity = 0.6,
  ...props
}: HoverBorderGradientProps<T>) => {
  const Tag = as || "button";
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "RIGHT", "BOTTOM", "LEFT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex + 1) % directions.length
      : (currentIndex - 1 + directions.length) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: `radial-gradient(18% 48% at 50% 0%, ${primaryColor} 0%, rgba(255, 255, 255, 0) 100%)`,
    RIGHT: `radial-gradient(15% 40% at 100% 50%, ${primaryColor} 0%, rgba(255, 255, 255, 0) 100%)`,
    BOTTOM: `radial-gradient(18% 48% at 50% 100%, ${primaryColor} 0%, rgba(255, 255, 255, 0) 100%)`,
    LEFT: `radial-gradient(15% 40% at 0% 50%, ${primaryColor} 0%, rgba(255, 255, 255, 0) 100%)`,
  };

  const highlight = `radial-gradient(85% 200% at 50% 50%, ${secondaryColor + Math.round(glowIntensity * 255).toString(16)} 0%, rgba(255, 255, 255, 0) 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "relative flex rounded-[24px] border border-transparent bg-gradient-to-br from-[rgba(76,81,191,0.15)] to-[rgba(127,156,245,0.15)] hover:bg-gradient-to-br hover:from-[rgba(76,81,191,0.25)] hover:to-[rgba(127,156,245,0.25)] transition-all duration-500 ease-out items-center justify-center p-1 shadow-[0_4px_15px_rgba(76,81,191,0.2)] hover:shadow-[0_6px_25px_rgba(76,81,191,${glowIntensity})] transform-gpu",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "relative z-10 bg-[rgba(10,10,20,0.85)] text-white px-8 py-3 rounded-[22px] font-semibold text-base tracking-tight font-['Inter',-apple-system,sans-serif] transition-transform duration-300 ease-out hover:scale-105 hover:shadow-inner",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-0 rounded-[24px] overflow-hidden"
        style={{
          filter: "blur(1px)",
          willChange: "background, filter",
        }}
        initial={{ background: movingMap[direction], opacity: 0.8 }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
          opacity: hovered ? 1 : 0.8,
          filter: hovered ? "blur(1.2px)" : "blur(1px)",
        }}
        transition={{ ease: "easeInOut", duration: duration, bounce: 0 }}
      />
      <div className="absolute inset-[1.5px] z-1 bg-[rgba(10,10,20,0.9)] rounded-[22px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]" />
    </Tag>
  );
};