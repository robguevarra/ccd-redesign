import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PracticeStructuredData } from '@/components/structured-data';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PracticeStructuredData />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
