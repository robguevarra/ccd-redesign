import Link from 'next/link';
import { practiceInfo } from '@/content/practice-info';

export function SiteFooter() {
  const dayLabel = (day: string) => day.slice(0, 3);

  return (
    <footer className="bg-stone-900 text-stone-200 mt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-serif text-2xl tracking-tight text-stone-50">
            {practiceInfo.brandName}
          </div>
          <p className="mt-4 text-sm text-stone-400 leading-relaxed">
            Considered dentistry in {practiceInfo.address.city}, since 1999. Led by Dr. Brien Hsu, DDS.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-stone-500">Visit</h3>
          <address className="mt-4 not-italic text-sm leading-relaxed">
            {practiceInfo.address.street}
            <br />
            {practiceInfo.address.city}, {practiceInfo.address.state}{' '}
            {practiceInfo.address.zip}
          </address>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-stone-500">Hours</h3>
          <ul className="mt-4 text-sm leading-relaxed font-mono tabular-nums">
            {practiceInfo.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{dayLabel(h.day)}</span>
                <span className="text-stone-400">
                  {h.closed ? 'Closed' : `${h.open}–${h.close}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-stone-500">Contact</h3>
          <ul className="mt-4 text-sm leading-relaxed space-y-1">
            {practiceInfo.phones.map((p) => (
              <li key={p.tel}>
                <span className="text-stone-500">{p.label} · </span>
                <a href={`tel:${p.tel}`} className="hover:text-white">
                  {p.number}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex gap-4 text-sm">
            {practiceInfo.socials.facebook && (
              <li>
                <a
                  href={practiceInfo.socials.facebook}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-stone-400 hover:text-white"
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
                  className="text-stone-400 hover:text-white"
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
                  className="text-stone-400 hover:text-white"
                >
                  Twitter
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {practiceInfo.brandName}. {practiceInfo.legalName}.
          </p>
          <nav className="flex gap-5">
            <Link href="/financing" className="hover:text-stone-300">
              Financing
            </Link>
            <Link href="/contact" className="hover:text-stone-300">
              Accessibility statement
            </Link>
            <Link href="/contact" className="hover:text-stone-300">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
