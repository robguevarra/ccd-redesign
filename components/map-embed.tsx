import { practiceInfo } from '@/content/practice-info';
import { cn } from '@/lib/cn';
import { MAPS_DIRECTIONS_URL } from '@/lib/maps';

/**
 * Interactive location map for the practice. Uses Google Maps' keyless embed
 * endpoint (`/maps?q=…&output=embed`) — no API key, no billing, no usage caps —
 * which is the right fit for a single practice location. The iframe is
 * `loading="lazy"` so it never blocks page render, and a "Get directions" link
 * is overlaid as both a convenience and a no-JS fallback.
 *
 * Address/brand come from the single practice-info source of truth; the
 * directions link routes through lib/maps so it resolves to the clinic listing
 * (not a neighbor sharing the building).
 */

const { brandName, googleListingName, address } = practiceInfo;
const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
// Lead the embed query with the exact listing name so the iframe centers on
// the clinic, not a neighboring business at the same address.
const query = `${googleListingName}, ${fullAddress}`;

const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
const DIRECTIONS_HREF = MAPS_DIRECTIONS_URL;

export function MapEmbed({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm',
        className,
      )}
    >
      <iframe
        title={`Map to ${brandName}, ${fullAddress}`}
        src={EMBED_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
      <a
        href={DIRECTIONS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 shadow-lg hover:bg-stone-700 transition-colors"
      >
        Get directions →
      </a>
    </div>
  );
}
