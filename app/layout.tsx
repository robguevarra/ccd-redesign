import type { Metadata } from 'next';
import './globals.css';
import { practiceInfo } from '@/content/practice-info';
import { fontSerif, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  metadataBase: new URL('https://dentisthsu-redesign.vercel.app'),
  title: {
    default: `${practiceInfo.brandName} — Considered dentistry in ${practiceInfo.address.city} since 1999`,
    template: `%s — ${practiceInfo.brandName}`,
  },
  description: `${practiceInfo.brandName} is a six-doctor dental practice in ${practiceInfo.address.city}, California, led by Dr. Brien Hsu, DDS. General, cosmetic, specialty (TMJ, sleep apnea), and orthodontic care.`,
  openGraph: {
    type: 'website',
    siteName: practiceInfo.brandName,
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
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
        {children}
      </body>
    </html>
  );
}
