"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Stack from "./Stack";
import SplitText from "./SplitText";
import BlurText from "./BlurText";
import { BookOpen } from "lucide-react"; // أو استخدم أي أيقونة تفضلها
import { UilBooks } from "@iconscout/react-unicons";

const images = [
  {
    id: 1,
    img: "https://i.pinimg.com/736x/f4/89/a0/f489a0b2c574d719b316efa9aa60d973.jpg",
  },
  {
    id: 2,
    img: "https://i.pinimg.com/736x/6c/77/e6/6c77e673ea5bba9155afbcbe8d1495f5.jpg",
  },
  {
    id: 3,
    img: "https://i.pinimg.com/736x/d9/20/78/d920781ff2d583d02f86cc61d42291ae.jpg",
  },
  {
    id: 4,
    img: "https://i.pinimg.com/736x/cf/8b/ef/cf8befc70db00a64d88d9c082b4d9158.jpg",
  },
];

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardSize = isMobile
    ? { width: 220, height: 300 }
    : { width: 300, height: 400 };

  const handleAnimationComplete = () => {
    console.log("Text animation done");
  };

  return (
    <section className="w-full px-6 sm:px-10 lg:px-20 py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">
        {/* ✅ Left Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 text-center md:text-left items-center md:items-start"
        >
          <SplitText
            text="One Book Can Shift Your Thinking — and Maybe Your Life."
            className="text-2xl sm:text-4xl font-bold text-indigo-600 leading-snug max-w-xl whitespace-normal break-words"
            delay={90}
            duration={0.6}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            onLetterAnimationComplete={handleAnimationComplete}
          />

          <BlurText
            text="Browse a curated library of over +120 premium PDF books in self-growth, entrepreneurship, and productivity. Each book is short, clear, and beautifully designed — between 80 and 300 pages, starting at just $2, with no subscriptions."
            delay={120}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-lg sm:text-xl leading-relaxed text-indigo-200 max-w-xl"
          />

          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
            {/* <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </motion.div> */}

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-md text-indigo-400 border border-indigo-500 bg-black hover:bg-indigo-900 transition"
              >
                <UilBooks className="w-5 h-5" />
                View Full Menu
              </Link>
            </motion.div>
            
          </div>
        </motion.div>

        {/* ✅ Right Card Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex justify-center w-full pr-4 sm:pr-8 md:pr-12"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={cardSize}
              cardsData={images}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
