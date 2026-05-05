import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode is the default in Next 15+, but explicit:
  reactStrictMode: true,

  // Pin Turbopack to the project root so it ignores parent-dir lockfiles.
  turbopack: {
    root: process.cwd(),
  },

  // Image domains — Supabase Storage, the legacy dentisthsu.com domain
  // for migrated imagery, and Unsplash for editorial pitch photography.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dentisthsu.com' },
      { protocol: 'https', hostname: '*.dentisthsu.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },

  // Experimental: enable Turbopack for dev (faster) and PPR for streaming SSR (P4 perf).
  experimental: {
    // ppr: 'incremental', // re-enable when we have explicit ppr boundaries
  },
};

export default nextConfig;
