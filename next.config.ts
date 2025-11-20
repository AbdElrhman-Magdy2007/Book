import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    domains: ["i.pinimg.com", "images.unsplash.com", "plus.unsplash.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Increased to handle large image uploads with form data overhead
      allowedOrigins: ['localhost:3000'],
    }
  },

  // API route configuration
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },

  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
