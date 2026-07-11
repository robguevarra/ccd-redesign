import type { NextConfig } from 'next';
import { permanentRedirects } from './lib/redirect-rules';

const nextConfig: NextConfig = {
  // Strict mode is the default in Next 15+, but explicit:
  reactStrictMode: true,

  // Migration 301s from the old WordPress dentisthsu.com URL space, flattened
  // to single hops. 410 Gone paths are handled in proxy.ts (redirects() can't
  // emit 410).
  async redirects() {
    return permanentRedirects;
  },

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

  // Server Actions: lift body limit to match our largest Storage upload cap
  // (patient-forms PDFs at 10MB). Default is 1MB which truncates real PDFs.
  experimental: {
    // ppr: 'incremental', // re-enable when we have explicit ppr boundaries
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
};

export default nextConfig;
