'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { onVideoReady, isVideoReady } from '@/lib/video-ready';

/**
 * Full-screen loader. Holds the viewport at z-[100] with a centered dental
 * mark until the home cinematic's video has buffered enough to play
 * through. Falls back to a 3-second max so a slow / cached network can't
 * leave the screen hanging.
 *
 * Mounted unconditionally on the home page; renders nothing once dismissed.
 */
export function LoadingScreen() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(!isVideoReady());

  useEffect(() => {
    if (!visible) return;

    // Subscribe to the video-ready signal from HomeColdOpenCinematic.
    const off = onVideoReady(() => setVisible(false));

    // 3-second hard fallback so this never blocks the page indefinitely
    // (slow networks, broken video host, etc).
    const fallback = setTimeout(() => setVisible(false), 3000);

    return () => {
      off();
      clearTimeout(fallback);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-label="Loading"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/dental.svg"
              alt=""
              className="h-16 w-16 md:h-20 md:w-20 invert opacity-95"
            />
            <span className="text-[10px] uppercase tracking-[0.32em] text-stone-300">
              Comfort Care · Est. 1999
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
