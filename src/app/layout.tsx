import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/ui/Header";
import NextAuthSessionProvider from "./providers/NextAuthSessionProvider";
import { Toaster } from "sonner";
import EnsureGuestSession from "@/components/EnsureGuestSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inkspire",
  description:
    "Inkspire - Discover, read, and get inspired by curated digital books in a beautiful, modern experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black `}
      >
        <EnsureGuestSession />
        <NextAuthSessionProvider>
          {/* <Navbar /> */}
          <Header />
          <Toaster position="top-right" />
          <main>{children}</main>
          <Footer />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
