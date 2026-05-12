import type { Metadata } from 'next';
import './globals.css';
import { practiceInfo } from '@/content/practice-info';
import { fontSerif, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import { LenisProvider } from '@/components/lenis-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://dentisthsu-redesign.vercel.app'),
  title: {
    default: `${practiceInfo.brandName} — Considered dentistry in ${practiceInfo.address.city} since 1999`,
    template: `%s — ${practiceInfo.brandName}`,
  },
  description: `Comfort Care Dental — a five-doctor hybrid medical and dental practice in Rancho Cucamonga since 1999. Family dentistry, restorative care, plus medical-grade orofacial pain, TMJ, and sleep apnea treatment under one roof.`,
  openGraph: {
    type: 'website',
    siteName: practiceInfo.brandName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  // Pitch site: do not index. See app/robots.ts for the matching rule and
  // the rationale. Flip both back together when promoting to production.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(fontSerif.variable, fontSans.variable)}>
      <body className="antialiased font-sans bg-stone-50 text-stone-800">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
