import Link from 'next/link';
import { Phone } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/technology', label: 'Technology' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

interface SiteHeaderProps {
  /** When true, renders dark-on-transparent — for use on the wow-zone hero. */
  variant?: 'light' | 'dark';
  className?: string;
}

export function SiteHeader({ variant = 'light', className }: SiteHeaderProps) {
  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur-md',
        variant === 'light'
          ? 'bg-stone-50/85 border-stone-200/60 text-stone-900'
          : 'bg-stone-900/40 border-stone-800/60 text-stone-50',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl tracking-tight font-medium"
        >
          {practiceInfo.brandName}
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/request-appointment"
            className={cn(
              'hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors',
              variant === 'light'
                ? 'bg-stone-900 text-stone-50 hover:bg-stone-700'
                : 'bg-stone-50 text-stone-900 hover:bg-stone-200',
            )}
          >
            Request appointment
          </Link>
          <a
            href={`tel:${main.tel}`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors',
              variant === 'light'
                ? 'border-stone-900 hover:bg-stone-900 hover:text-stone-50'
                : 'border-stone-50 hover:bg-stone-50 hover:text-stone-900',
            )}
            aria-label={`Call ${practiceInfo.brandName} at ${main.number}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{main.number}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}
