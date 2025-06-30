"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

interface NextAuthSessionProviderProps {
  children: ReactNode;
}

// Loading component for authentication state
function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  useEffect(() => {
    // Log the error to your error tracking service
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Something went wrong with authentication
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => {
          // Clear any stale session data
          localStorage.removeItem("next-auth.session-token");
          sessionStorage.clear();
          resetErrorBoundary();
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export default function NextAuthSessionProvider({
  children,
}: NextAuthSessionProviderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Skip session loading for public routes
  const isPublicRoute = pathname?.startsWith("/auth") || pathname === "/";
console.log(isPublicRoute)
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle session error recovery
  useEffect(() => {
    const handleSessionError = (event: StorageEvent) => {
      if (event.key === "next-auth.session-token" && !event.newValue) {
        // Session token was removed, clear any stale data
        localStorage.removeItem("next-auth.session-token");
        sessionStorage.clear();
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleSessionError);
    return () => window.removeEventListener("storage", handleSessionError);
  }, []);

  if (!mounted) {
    return <AuthLoading />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Force a hard refresh to clear any stale state
        window.location.reload();
      }}
    >
      <SessionProvider
        refetchInterval={0}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
      >
        <Suspense fallback={<AuthLoading />}>{children}</Suspense>
      </SessionProvider>
    </ErrorBoundary>
  );
}
