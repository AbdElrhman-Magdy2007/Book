// app/profile/page.tsx
import { Pages, Routes } from "@/constants/enums";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { authOptions } from "../server/auth";
import EditUserForm from "@/components/edit-user-form";
import { UserRole } from "@prisma/client";
import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Profile | Book Landing",
  description: "Manage your account details and preferences",
  keywords: ["profile", "account", "settings", "user"],
  openGraph: {
    title: "Profile | Book Landing",
    description: "Manage your account details and preferences",
    type: "website",
  },
  robots: {
    index: false, // Don't index profile pages
    follow: false,
  },
};

// Type definitions
interface ProfilePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface ParticleConfig {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

// Constants - Using UPPER_CASE for constants
const PARTICLE_COUNT = 12;
const PARTICLE_SIZE_RANGE = { min: 4, max: 10 };
const ANIMATION_DURATION_RANGE = { min: 3, max: 8 };
const ANIMATION_DELAY_RANGE = { min: 0, max: 2 };

// Utility functions with memoization for performance
const generateParticleConfig = (): ParticleConfig[] => {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size:
      Math.random() * (PARTICLE_SIZE_RANGE.max - PARTICLE_SIZE_RANGE.min) +
      PARTICLE_SIZE_RANGE.min,
    duration:
      Math.random() *
        (ANIMATION_DURATION_RANGE.max - ANIMATION_DURATION_RANGE.min) +
      ANIMATION_DURATION_RANGE.min,
    delay: Math.random() * ANIMATION_DELAY_RANGE.max,
  }));
};

// Loading component with better accessibility
const ProfileLoadingFallback = () => (
  <div
    className="flex justify-center items-center py-16"
    role="status"
    aria-live="polite"
  >
    <div className="flex flex-col items-center gap-4">
      <Loader
        className="w-12 h-12 animate-spin text-primary"
        aria-label="Loading profile data"
      />
      <p className="text-muted-foreground text-sm font-medium">
        Loading your profile...
      </p>
      <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse rounded-full" />
      </div>
    </div>
  </div>
);

// Error component with better UX
const ProfileErrorFallback = ({ error }: { error?: Error }) => (
  <div className="text-center py-16">
    <div className="flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <div className="max-w-md">
        <h3 className="text-xl font-semibold text-destructive mb-3">
          Unable to Load Profile
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {error?.message ||
            "We encountered an issue loading your profile data. Please refresh the page or try again later."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Animated background component with performance optimization
const AnimatedBackground = () => {
  const particles = generateParticleConfig();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="particle-wave pointer-events-none relative w-full h-full">
        {particles.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className="particle absolute bg-primary/20 rounded-full blur-sm will-change-transform"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Main component with comprehensive error handling
export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  try {
    // Get session with timeout handling
    const session = await getServerSession(authOptions);

    // Authentication check with detailed error
    if (!session?.user) {
      console.warn("Profile access attempted without session");
      redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
    }

    // Role-based redirect with logging
    if (session.user.role === UserRole.ADMIN) {
      console.log(
        `Admin user ${session.user.email} redirected to admin dashboard`
      );
      redirect(`/${Routes.ADMIN}`);
    }

    return (
      <main
        className="relative min-h-screen bg-background overflow-hidden transition-colors duration-300"
        role="main"
        aria-labelledby="profile-title"
      >
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Main Content */}
        <section className="relative z-10 py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header */}
            <header className="text-center mb-12 lg:mb-16">
              <h1
                id="profile-title"
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent animate-fade-in"
              >
                Your Profile
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground animate-fade-in delay-200 max-w-2xl mx-auto leading-relaxed">
                Manage your account details and preferences with ease
              </p>
            </header>

            {/* Profile Card */}
            <div className="max-w-4xl mx-auto animate-fade-in delay-400">
              <div className="bg-card/80 backdrop-blur-md rounded-2xl shadow-xl p-6 lg:p-8 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-2xl">
                <Suspense fallback={<ProfileLoadingFallback />}>
                  <ProfileClient user={session.user} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    // Comprehensive error logging
    console.error("Profile page error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "server",
    });

    // Fallback UI for errors
    return (
      <main className="min-h-screen bg-background flex items-center justify-center ">
        <ProfileErrorFallback
          error={error instanceof Error ? error : undefined}
        />
      </main>
    );
  }
}
