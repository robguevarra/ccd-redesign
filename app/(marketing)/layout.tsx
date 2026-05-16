import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PracticeStructuredData } from '@/components/structured-data';
import { LaneWrapper } from './lane-wrapper';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LaneWrapper>
      <PracticeStructuredData />
      <SiteHeader />
      {children}
      <SiteFooter />
    </LaneWrapper>
  );
}
