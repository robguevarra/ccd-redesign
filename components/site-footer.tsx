'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { practiceInfo } from '@/content/practice-info';
import type { BusinessHours } from '@/content/schemas';
import { DEFAULT_OFFICE_HOURS, formatDayHours } from '@/lib/office-hours';
import { getLane } from '@/lib/lane';
import { Wordmark } from './wordmark';

export function SiteFooter({ hours = DEFAULT_OFFICE_HOURS }: { hours?: BusinessHours[] }) {
  const pathname = usePathname();
  const lane = getLane(pathname);
  const dayLabel = (day: string) => day.slice(0, 3);
  const primaryPhone = practiceInfo.phones[0];

  return (
    <footer data-lane={lane} className="bg-stone-900 text-stone-200 mt-32 transition-colors duration-500 ease-out">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-200)] mb-2">
                Dental Practice
              </p>
              <Wordmark variant="dark" lane="dental" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-200)] mb-2">
                Medical Practice
              </p>
              <Wordmark variant="dark" lane="medical" />
            </div>
          </div>
          <p className="mt-6 text-sm text-stone-400 leading-relaxed">
            Advanced dental and medical care led by Dr. Brien Hsu, DDS.
            <br />
            {practiceInfo.address.city} · Est. 1993.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-200)]">
            Visit
          </h3>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${practiceInfo.address.street}, ${practiceInfo.address.city}, ${practiceInfo.address.state} ${practiceInfo.address.zip}`,
              )}`}
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
            © {new Date().getFullYear()} {practiceInfo.brandName}.{' '}
            {practiceInfo.legalName}.
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
