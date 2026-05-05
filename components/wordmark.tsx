import { cn } from '@/lib/cn';

interface WordmarkProps {
  className?: string;
  /** Accessible label override. Default: brand name. */
  ariaLabel?: string;
  /** Color theme. */
  variant?: 'light' | 'dark';
}

/**
 * SVG wordmark for Comfort Care Dental. Inline SVG so it scales crisply at
 * any size and inherits its color from CSS — no PNG raster, no Google Font
 * fallback flash on load.
 *
 * Composed of two glyph rows with a deliberate typographic conceit: an italic
 * "Care" mark sits between the roman "Comfort" and "Dental." That italic
 * pivot is the visual signature.
 */
export function Wordmark({
  className,
  ariaLabel = 'Comfort Care Dental',
  variant = 'light',
}: WordmarkProps) {
  const fill = variant === 'light' ? 'currentColor' : '#fafaf9';

  return (
    <svg
      viewBox="0 0 240 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cn('inline-block h-7 md:h-8 w-auto', className)}
      fill="none"
    >
      <text
        x="0"
        y="29"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize="28"
        fontWeight="400"
        letterSpacing="-0.02em"
        fill={fill}
      >
        Comfort
        <tspan fontStyle="italic" fontWeight="300" dx="6">
          Care
        </tspan>
        <tspan dx="6">Dental</tspan>
      </text>
    </svg>
  );
}
