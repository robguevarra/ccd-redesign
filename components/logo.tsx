import Image from 'next/image';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** Pixel size — applied to both width and height (logo is square). Default 28. */
  size?: number;
  /** Mobile size (≤640px). Default 24. */
  mobileSize?: number;
  className?: string;
  /** When true, the logo is decorative beside a wordmark — alt is empty. */
  decorative?: boolean;
}

/**
 * Comfort Care Dental practice mark (moon + face profile + star + tooth).
 * Square aspect. Pairs with `<Wordmark />` in the header lockup; can also
 * appear standalone as an end-mark on blog posts and section dividers.
 */
export function Logo({
  size = 28,
  mobileSize = 24,
  className,
  decorative = false,
}: LogoProps) {
  return (
    <Image
      src="/logo.webp"
      alt={decorative ? '' : 'Comfort Care Dental'}
      width={size}
      height={size}
      sizes={`(max-width: 640px) ${mobileSize}px, ${size}px`}
      style={{ width: size, height: size }}
      className={cn('inline-block select-none [filter:none]', className)}
      priority
    />
  );
}
