"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyScrollProps {
  content: {
    title: string;
    description: string;
    content: React.ReactNode;
  }[];
}

export const StickyScroll: React.FC<StickyScrollProps> = ({ content }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const cardsBreakpoints = content.map((_, index) => index / cardLength);
      const activeCardIndex = cardsBreakpoints.findIndex(
        (breakpoint) => breakpoint > latest
      );
      setActiveCard(
        activeCardIndex === -1 ? cardLength - 1 : activeCardIndex - 1
      );
    });

    return () => unsubscribe();
  }, [scrollYProgress, cardLength, content]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center min-h-screen bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-full max-w-4xl px-4"
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0, 0.2, 0.8, 1],
              [1, 1, 1, 0]
            ),
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                {content[activeCard].title}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {content[activeCard].description}
              </p>
            </div>
            <div className="flex items-center justify-center">
              {content[activeCard].content}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="h-[300vh] w-full" />
    </div>
  );
};
