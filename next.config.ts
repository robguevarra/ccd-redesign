import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode is the default in Next 15+, but explicit:
  reactStrictMode: true,

  // Pin Turbopack to the project root so it ignores parent-dir lockfiles.
  turbopack: {
    root: process.cwd(),
  },

  // Image domains — for now, allow Supabase Storage + the existing
  // dentisthsu.com domain so we can lazily migrate scraped imagery.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dentisthsu.com' },
      { protocol: 'https', hostname: '*.dentisthsu.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  // Experimental: enable Turbopack for dev (faster) and PPR for streaming SSR (P4 perf).
  experimental: {
    // ppr: 'incremental', // re-enable when we have explicit ppr boundaries
  },
};

export default nextConfig;
