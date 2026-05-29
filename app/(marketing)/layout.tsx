import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PracticeStructuredData } from '@/components/structured-data';
import { AccessibilityButton } from '@/components/a11y/accessibility-button';
import { getOfficeHours } from '@/lib/supabase/queries';
import { LaneWrapper } from './lane-wrapper';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Office hours are admin-editable; the footer shows them on every page.
  const hours = await getOfficeHours();

  return (
    <LaneWrapper>
      <PracticeStructuredData />
      <SiteHeader />
      {children}
      <SiteFooter hours={hours} />
      <AccessibilityButton />
    </LaneWrapper>
  );
}
