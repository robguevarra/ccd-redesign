'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

type MotionTag = 'div' | 'section' | 'article' | 'header' | 'aside';

interface FadeUpProps extends Omit<HTMLMotionProps<'div'>, 'as'> {
  /** Render-as element. Default 'div'. */
  as?: MotionTag;
  /** Translate distance in px. Default: 12 (master spec considered-tier). */
  distance?: number;
  /** Delay in seconds. */
  delay?: number;
  /** Duration in seconds. Default 0.45. */
  duration?: number;
  /** Whether to fire only once when entering view. Default true. */
  once?: boolean;
}

/**
 * Section-level fade + 8–12px translate reveal. Master spec §5 motion language
 * "considered" tier. Triggers on scroll into view; respects prefers-reduced-motion.
 */
export function FadeUp({
  as = 'div',
  children,
  distance = 12,
  delay = 0,
  duration = 0.45,
  once = true,
  className,
  ...props
}: FadeUpProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children as React.ReactNode}</Tag>;
  }

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      // Height-independent trigger: fire once the element's top is ~90px into
      // the viewport. The previous `amount: 0.2` required 20% of the ELEMENT
      // to be visible — a section much taller than the viewport (e.g. the
      // myofascial service body on a phone) could never reach that threshold
      // and stayed invisible ("blank section", client report 2026-07).
      viewport={{ once, margin: '0px 0px -90px 0px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
