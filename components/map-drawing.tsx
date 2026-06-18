import { practiceInfo } from '@/content/practice-info';
import { cn } from '@/lib/cn';

/**
 * Hand-drawn-style location map — a simple, on-brand SVG schematic instead of a
 * live Google embed. No iframe, no API key, no third-party calls: it loads
 * instantly and themes with the site. It shows the orienting landmarks (the 210
 * freeway, Milliken Ave, Kenyon Way, the Vineyards Marketplace plaza) with a pin
 * on the practice; the "Get directions" button deep-links to Google Maps for the
 * actual turn-by-turn. Swap the SVG for a commissioned illustration anytime.
 */

const { brandName, address } = practiceInfo;
const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
const DIRECTIONS_HREF = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

export function MapDrawing({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm',
        className,
      )}
    >
      <svg
        viewBox="0 0 800 500"
        role="img"
        aria-label={`Map showing ${brandName} at the corner of Kenyon Way and Milliken Avenue, just south of the 210 freeway, in Rancho Cucamonga`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* paper / blocks */}
        <rect width="800" height="500" className="fill-stone-50" />
        <g className="fill-stone-100">
          <rect x="40" y="120" width="170" height="110" rx="8" />
          <rect x="40" y="360" width="170" height="100" rx="8" />
          <rect x="650" y="360" width="120" height="100" rx="8" />
          <rect x="650" y="120" width="120" height="110" rx="8" />
        </g>

        {/* 210 freeway — band across the top */}
        <rect x="-10" y="58" width="820" height="40" className="fill-stone-300" />
        <line
          x1="-10" y1="78" x2="810" y2="78"
          className="stroke-stone-50"
          strokeWidth="2.5" strokeDasharray="16 12"
        />
        {/* freeway shield */}
        <g transform="translate(96 78)">
          <rect x="-30" y="-17" width="60" height="34" rx="8" className="fill-stone-800" />
          <text x="0" y="6" textAnchor="middle" className="fill-stone-50" style={{ font: '700 19px var(--font-sans, sans-serif)' }}>
            210
          </text>
        </g>

        {/* Milliken Ave — vertical arterial */}
        <rect x="556" y="-10" width="40" height="520" className="fill-stone-300" />
        <line x1="576" y1="-10" x2="576" y2="510" className="stroke-stone-50" strokeWidth="2.5" strokeDasharray="16 12" />

        {/* Kenyon Way — horizontal road */}
        <rect x="-10" y="282" width="820" height="34" className="fill-stone-300" />
        <line x1="-10" y1="299" x2="810" y2="299" className="stroke-stone-50" strokeWidth="2" strokeDasharray="14 10" />

        {/* Vineyards Marketplace plaza (NW of the corner) */}
        <rect x="360" y="196" width="176" height="74" rx="10" className="fill-[var(--color-accent-50)] stroke-[var(--color-accent-200)]" strokeWidth="1.5" />
        <text x="448" y="238" textAnchor="middle" className="fill-stone-500" style={{ font: '600 12px var(--font-sans, sans-serif)', letterSpacing: '0.06em' }}>
          VINEYARDS
        </text>
        <text x="448" y="254" textAnchor="middle" className="fill-stone-500" style={{ font: '600 12px var(--font-sans, sans-serif)', letterSpacing: '0.06em' }}>
          MARKETPLACE
        </text>

        {/* Road labels */}
        <text x="210" y="274" className="fill-stone-500" style={{ font: '600 13px var(--font-sans, sans-serif)', letterSpacing: '0.14em' }}>
          KENYON WAY
        </text>
        <text transform="translate(548 430) rotate(-90)" className="fill-stone-500" style={{ font: '600 13px var(--font-sans, sans-serif)', letterSpacing: '0.14em' }}>
          MILLIKEN AVE
        </text>

        {/* Pin on the practice */}
        <g transform="translate(448 196)">
          <ellipse cx="0" cy="6" rx="13" ry="4" className="fill-stone-400" opacity="0.4" />
          <path
            d="M0 4 C-13 4 -22 -7 -22 -20 C-22 -33 -12 -42 0 -42 C12 -42 22 -33 22 -20 C22 -7 13 4 0 4 Z"
            className="fill-[var(--color-accent-600)]"
          />
          <circle cx="0" cy="-21" r="7.5" className="fill-stone-50" />
        </g>
        <text x="448" y="150" textAnchor="middle" className="fill-stone-900" style={{ font: '600 16px var(--font-serif, serif)' }}>
          Comfort Care Dental
        </text>

        {/* compass */}
        <g transform="translate(748 444)" className="fill-stone-400">
          <path d="M0 -16 L5 6 L0 1 L-5 6 Z" />
          <text x="0" y="22" textAnchor="middle" style={{ font: '700 11px var(--font-sans, sans-serif)' }}>N</text>
        </g>
      </svg>

      {/* address + directions */}
      <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-stone-900/85 to-stone-900/0 px-5 pb-4 pt-10 text-stone-50">
        <span className="text-sm leading-snug">
          {address.street}
          <br className="sm:hidden" />
          <span className="hidden sm:inline">, </span>
          {address.city}, {address.state} {address.zip}
        </span>
        <a
          href={DIRECTIONS_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-stone-50 px-5 py-2.5 text-sm font-medium text-stone-900 shadow hover:bg-stone-200 transition-colors"
        >
          Get directions →
        </a>
      </figcaption>
    </figure>
  );
}
