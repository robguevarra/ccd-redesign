'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { practiceInfo } from '@/content/practice-info';
import type { BusinessHours } from '@/content/schemas';
import { DEFAULT_OFFICE_HOURS, formatDayHours } from '@/lib/office-hours';
import { getLane } from '@/lib/lane';
import { MAPS_DIRECTIONS_URL } from '@/lib/maps';
import { cn } from '@/lib/cn';
import { Wordmark } from './wordmark';

// Routes whose last section is a dark (stone-900) CTA band. On those the
// footer sits flush with a hairline divider — the default mt-32 would show a
// 128px slice of light page background between two identical dark blocks.
const DARK_ENDING_ROUTES = new Set([
  '/medical/tmj',
  '/reviews',
  '/financing',
  '/technology',
]);

export function SiteFooter({ hours = DEFAULT_OFFICE_HOURS }: { hours?: BusinessHours[] }) {
  const pathname = usePathname();
  const lane = getLane(pathname);
  const dayLabel = (day: string) => day.slice(0, 3);
  const primaryPhone = practiceInfo.phones[0];
  const flushDark = DARK_ENDING_ROUTES.has(pathname);

  return (
    <footer
      data-lane={lane}
      className={cn(
        'bg-stone-900 text-stone-200 transition-colors duration-500 ease-out',
        flushDark ? 'border-t border-stone-800' : 'mt-32',
      )}
    >
      {/* Brand — full-width row so each practice's logo sits beside its name */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-16 md:pt-20">
        {/* Client request #28: practice names on the sides, tagline centered. */}
        <div className="flex flex-col gap-8 border-b border-stone-800 pb-12 lg:grid lg:grid-cols-3 lg:items-center lg:gap-12">
          <div className="flex items-center gap-3.5 lg:justify-self-start">
            <Image
              src="/logos/dental-3.png"
              alt=""
              width={44}
              height={44}
              className="invert shrink-0"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-200)] mb-1">
                Dental Practice
              </p>
              <Wordmark variant="dark" lane="dental" />
            </div>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed lg:max-w-[17rem] lg:justify-self-center lg:text-center">
            Advanced dental and medical care led by Dr. Brien Hsu.
            <br />
            {practiceInfo.address.city} · Est. 1993.
          </p>
          <div className="flex items-center gap-3.5 lg:justify-self-end">
            <Image
              src="/logos/medical-4.png"
              alt=""
              width={44}
              height={44}
              className="invert shrink-0"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-200)] mb-1">
                Medical Practice
              </p>
              <Wordmark variant="dark" lane="medical" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12 md:py-16 grid gap-12 sm:grid-cols-3">
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-200)]">
            Visit
          </h3>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              {practiceInfo.address.street}
              <br />
              {practiceInfo.address.city}, {practiceInfo.address.state}{' '}
              {practiceInfo.address.zip}
            </a>
          </address>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-200)]">
            Hours
          </h3>
          <ul className="mt-4 text-sm leading-relaxed tabular-nums">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{dayLabel(h.day)}</span>
                <span className="text-stone-400">{formatDayHours(h)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-200)]">
            Contact
          </h3>
          <ul className="mt-4 text-sm leading-relaxed space-y-2">
            {primaryPhone && (
              <li>
                <span className="text-stone-500">{primaryPhone.label} · </span>
                <a
                  href={`tel:${primaryPhone.tel}`}
                  className="hover:text-[var(--color-accent-200)] transition-colors"
                >
                  {primaryPhone.number}
                </a>
              </li>
            )}
            {practiceInfo.email && (
              <li>
                <a
                  href={`mailto:${practiceInfo.email}`}
                  className="text-stone-300 hover:text-[var(--color-accent-200)] transition-colors"
                >
                  {practiceInfo.email}
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-6 flex gap-4 text-sm">
            {practiceInfo.socials.facebook && (
              <li>
                <a
                  href={practiceInfo.socials.facebook}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-stone-400 hover:text-[var(--color-accent-200)] transition-colors"
                >
                  Facebook
                </a>
              </li>
            )}
            {practiceInfo.socials.google && (
              <li>
                <a
                  href={practiceInfo.socials.google}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-stone-400 hover:text-[var(--color-accent-200)] transition-colors"
                >
                  Google
                </a>
              </li>
            )}
            {practiceInfo.socials.yelp && (
              <li>
                <a
                  href={practiceInfo.socials.yelp}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-stone-400 hover:text-[var(--color-accent-200)] transition-colors"
                >
                  Yelp
                </a>
              </li>
            )}
            {practiceInfo.socials.twitter && (
              <li>
                <a
                  href={practiceInfo.socials.twitter}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-stone-400 hover:text-[var(--color-accent-200)] transition-colors"
                >
                  Twitter
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[16px] text-[12px] text-stone-500">
          <p>
            © {new Date().getFullYear()} {practiceInfo.legalName}. All rights
            reserved.
          </p>
          <nav className="flex flex-wrap gap-x-[20px] gap-y-[8px]">
            <Link
              href="/dental"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Dental
            </Link>
            <Link
              href="/medical"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Medical
            </Link>
            <Link
              href="/blog"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/patient-forms"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Patient Forms
            </Link>
            <Link
              href="/financing"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Financing
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Accessibility
            </Link>
            <Link
              href="/contact"
              className="hover:text-[var(--color-accent-200)] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/admin/login"
              className="text-stone-600 hover:text-[var(--color-accent-200)] transition-colors"
              aria-label="Staff admin sign in"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
