'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth-scroll. Mounts a single global instance, hands the RAF loop to
 * Lenis, and respects prefers-reduced-motion (no smoothing, native scroll).
 *
 * Also resets scroll position to top on every route change. Without this,
 * Next.js's default scroll-to-top behavior gets fought by Lenis's RAF loop
 * (Lenis tracks its own scroll target separately from window.scrollY), so
 * navigating between pages would land you mid-page on the new route.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    // Expose for components that need to programmatically scroll without
    // fighting the RAF loop (e.g. the pinned-scroll snap in WhyPatientsStay).
    window.__lenis = lenis;

    let raf: number;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = undefined;
    };
  }, []);

  // Reset scroll on route change so each new page lands at its top.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
