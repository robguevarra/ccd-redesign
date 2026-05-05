import { Fraunces, Geist } from 'next/font/google';

/**
 * Display face. Fraunces is a high-contrast variable serif with strong italic
 * counterforms — close in feel to Reckless / GT Sectra but free.
 * Per master spec §5 type system principles.
 */
export const fontSerif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
});

/** Body face. Geist Sans — humanist, great at small sizes. */
export const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
