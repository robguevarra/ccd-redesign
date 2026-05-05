import type { Metadata } from 'next';
import './globals.css';
import { practiceInfo } from '@/content/practice-info';

export const metadata: Metadata = {
  title: {
    default: `${practiceInfo.brandName} — Considered dentistry in Rancho Cucamonga since 1999`,
    template: `%s — ${practiceInfo.brandName}`,
  },
  description: `${practiceInfo.brandName} is a six-doctor dental practice in Rancho Cucamonga, California, led by Dr. Brien Hsu. General, cosmetic, specialty, and orthodontic care.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
