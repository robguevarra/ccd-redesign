import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Accessibility',
  description: `Accessibility statement for ${practiceInfo.brandName} — our commitment to WCAG 2.1 AA and how to report a barrier.`,
};

export default function AccessibilityPage() {
  const primaryPhone = practiceInfo.phones[0];
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            For everyone
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter text-stone-900 leading-[0.95]">
            Accessibility
          </h1>
          <p className="mt-10 max-w-2xl text-stone-700 text-lg leading-relaxed">
            {practiceInfo.brandName} is committed to making this website usable
            by everyone, including people with disabilities. We follow the
            Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24 prose prose-stone prose-lg prose-headings:font-serif prose-headings:tracking-tight">
        <h2>What we&apos;ve built in</h2>
        <ul>
          <li><strong>Keyboard navigation.</strong> Every interactive control on this site is reachable and operable with a keyboard. Focus rings are visible.</li>
          <li><strong>Semantic structure.</strong> Headings, landmarks, lists, and form labels are marked up so screen readers can announce them correctly.</li>
          <li><strong>Color contrast.</strong> Body text and primary controls meet or exceed the WCAG AA 4.5:1 contrast ratio.</li>
          <li><strong>Reduced motion.</strong> Scroll-driven animations and transitions are disabled automatically when your device or browser is set to reduce motion.</li>
          <li><strong>Resizable text.</strong> The site uses scalable units so increasing your browser&apos;s text size enlarges the content as expected.</li>
          <li><strong>Alt text on images.</strong> All non-decorative images carry descriptive alt text.</li>
        </ul>

        <h2>On-page tools</h2>
        <p>
          The accessibility button in the bottom-right corner opens a panel with
          quick toggles you can use without changing your device settings:
          larger text, high contrast, light background, underlined links,
          grayscale, and a more legible font. Your choices save on this device.
        </p>
        <p className="text-sm text-stone-500">
          These tools augment your browser and operating system settings —
          they don&apos;t replace them. For the best experience, configure
          accessibility preferences in your OS or browser directly.
        </p>

        <h2>Report a barrier</h2>
        <p>
          If you find a part of this site you can&apos;t use, please tell us.
          We treat accessibility issues as bugs and fix them.
        </p>
        <ul>
          {practiceInfo.email && (
            <li>
              Email:{' '}
              <a href={`mailto:${practiceInfo.email}`} className="underline">
                {practiceInfo.email}
              </a>
            </li>
          )}
          {primaryPhone && (
            <li>
              Phone:{' '}
              <a href={`tel:${primaryPhone.tel}`} className="underline">
                {primaryPhone.number}
              </a>
            </li>
          )}
        </ul>

        <h2>Standards</h2>
        <p>
          This site targets <strong>WCAG 2.1 Level AA</strong>. Conformance is
          checked through a combination of automated audits (axe-core,
          Lighthouse) and manual review.
        </p>

        <h2>Last updated</h2>
        <p>
          This statement was last reviewed on{' '}
          {new Date('2026-05-20').toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}.
        </p>

        <hr />
        <p>
          <Link href="/contact">Contact us</Link> for any other questions.
        </p>
      </section>
    </>
  );
}
