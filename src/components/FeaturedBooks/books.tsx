"use client";

import ScrollFloat from "./ScrollFloat";
import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const books = [
  {
    id: 1,
    title: "Deep Focus Mastery",
    pages: 120,
    price: "$6.99",
    image: "https://i.pinimg.com/736x/66/31/65/66316590a7130ee75ed04d831fc4792f.jpg",
  },
  {
    id: 2,
    title: "Build Better Habits",
    pages: 98,
    price: "$4.99",
    image: "https://i.pinimg.com/736x/07/57/35/075735c92f640d933e134a36191a0f1d.jpg",
  },
  {
    id: 3,
    title: "Mindset Reset",
    pages: 130,
    price: "$7.99",
    image: "https://i.pinimg.com/736x/d0/41/fc/d041fc6aaf37a5dcb488d9a4be5cf2e4.jpg",
  },
];

const AceternityLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 66 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-black dark:text-white"
  >
    <path
      d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
      stroke="currentColor"
      strokeWidth="15"
      strokeMiterlimit="3.86874"
      strokeLinecap="round"
    />
  </svg>
);

export default function BooksSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* العنوان المتحرك */}
        <ScrollFloat speed={1.2}>Explore Our Featured Books</ScrollFloat>

        {/* وصف تسويقي جذاب */}
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
          Discover beautifully crafted digital books that boost clarity, enhance
          your habits, and elevate your thinking — starting from&nbsp;
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            just $1
          </span>
          .
        </p>

        {/* البطاقات */}
        <div className="grid gap-4 sm:gap-8 lg:gap-16 mt-12 sm:mt-14 lg:mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <CardContainer
              key={book.id}
              className="inter-var group"
              containerClassName="hover:scale-105 transition-transform duration-500 ease-out w-full max-w-sm mx-auto lg:max-w-md"
            >
              <CardBody className="bg-white dark:bg-zinc-900/90 relative border border-indigo-100 dark:border-indigo-900/50 w-full rounded-2xl p-6 sm:p-8 shadow-lg group-hover:shadow-[0_8px_30px_rgba(76,81,191,0.2)] dark:group-hover:shadow-[0_8px_30px_rgba(127,156,245,0.25)] transition-all duration-500">
                <CardItem
                  translateZ="60"
                  className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight"
                >
                  {book.title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="50"
                  className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2"
                >
                  {book.pages} pages • {book.price}
                </CardItem>
                <CardItem translateZ="80" className="w-full mt-6">
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={800}
                    height={600}
                    className="rounded-xl object-cover w-full h-64 sm:h-72 lg:h-80 shadow-md group-hover:shadow-[0_4px_15px_rgba(76,81,191,0.3)] transition-shadow duration-300"
                    priority
                  />
                </CardItem>
                <div className="mt-8 flex justify-center">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white flex items-center space-x-2 px-6 py-3 text-sm sm:text-base font-semibold tracking-tight"
                    primaryColor="#4c51bf"
                    secondaryColor="#7f9cf5"
                    glowIntensity={0.7}
                  >
                    <AceternityLogo />
                    <span>View Book</span>
                  </HoverBorderGradient>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
