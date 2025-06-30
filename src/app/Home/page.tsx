"use client";
import FeaturesSection from "@/components/FeaturesSection";
import Hero from "@/components/Hero/index";
import FeaturedBooks from "@/components/FeaturedBooks";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <Hero />
      <FeaturesSection />
      <FeaturedBooks />
      <HowItWorks />
    </main>
    </>
  );
}