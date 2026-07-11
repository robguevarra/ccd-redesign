import type { Metadata } from 'next';
import './globals.css';
import { practiceInfo } from '@/content/practice-info';
import { fontSerif, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import { SITE_URL } from '@/lib/site';
import { LenisProvider } from '@/components/lenis-provider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Default title is the OG card title — kept under 60 chars so it doesn't
  // truncate in link previews. Page-specific titles slot into the template.
  title: {
    default: `${practiceInfo.brandName} — TMJ & dental care, ${practiceInfo.address.city}`,
    template: `%s — ${practiceInfo.brandName}`,
  },
  // OG/Twitter card description — kept in the 110–160 char sweet spot so it
  // doesn't get clipped by Slack/iMessage/Twitter previews.
  description: `Rancho Cucamonga's five-doctor hybrid dental & medical practice. Family care, TMJ, sleep apnea, and orofacial pain — under one roof since 1993.`,
  openGraph: {
    type: 'website',
    siteName: practiceInfo.brandName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  // Self-referencing canonical on every page ('./' resolves against
  // metadataBase + the current path). Guards against the www host serving
  // duplicate content until the Vercel-level www -> apex redirect is set.
  alternates: {
    canonical: './',
  },
  // Production: indexable. The pitch-era noindex was removed at the
  // 2026-07 switchover; /admin keeps its own noindex in app/admin/layout.tsx.
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
