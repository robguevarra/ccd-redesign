'use client';

import { usePathname } from 'next/navigation';
import { getLane } from '@/lib/lane';

/**
 * Persistent lane-aware wrapper for the marketing routes. Sits inside
 * <body> and wraps the header + page + footer. Its data-lane attribute
 * comes from usePathname() so navigating between routes mutates the
 * existing DOM element rather than remounting — letting CSS transitions
 * (background, accent vars) animate smoothly during route changes.
 *
 * Server-renders correctly because usePathname returns the request's
 * pathname during SSR in App Router.
 */
export function LaneWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lane = getLane(pathname);
  return (
    <div
      data-lane={lane}
      className="min-h-screen bg-[var(--color-surface)] transition-colors duration-700 ease-out"
    >
      {children}
    </div>
  );
}
