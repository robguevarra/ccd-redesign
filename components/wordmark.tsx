import { cn } from '@/lib/cn';

interface WordmarkProps {
  className?: string;
  ariaLabel?: string;
  variant?: 'light' | 'dark';
}

/**
 * SVG wordmark for Comfort Care Dental. Inline SVG so it scales crisply at
 * any size and inherits color via CSS — no PNG raster, no font fallback flash.
 *
 * Composed using explicit tspan x positioning so the layout is deterministic
 * and never truncates, regardless of font availability.
 */
export function Wordmark({
  className,
  ariaLabel = 'Comfort Care Dental',
  variant = 'light',
}: WordmarkProps) {
  const fill = variant === 'light' ? 'currentColor' : '#fafaf9';

  return (
    <svg
      viewBox="0 0 360 44"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cn('inline-block h-7 md:h-8 w-auto select-none', className)}
      fill="none"
    >
      <g
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize="32"
        letterSpacing="-0.02em"
        fill={fill}
      >
        <text x="0" y="32" fontWeight="400">
          Comfort
        </text>
        <text x="125" y="32" fontWeight="300" fontStyle="italic">
          Care
        </text>
        <text x="200" y="32" fontWeight="400">
          Dental
        </text>
      </g>
    </svg>
  );
}
