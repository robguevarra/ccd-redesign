import { getLane } from './lane';

/**
 * Resolves the lane-aware sub-label shown beneath the wordmark in the header.
 * Pure pathname → string mapping; safe to call from server or client. Currently
 * consumed in `<SiteHeader>` (a client component) via `usePathname()`.
 *
 * Delegates segment-boundary safety to `getLane()` so a future route like
 * `/dental-hygiene-guide` doesn't silently resolve to the dental sub-label.
 *
 * See: docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md §3
 */
export function getSublabel(pathname: string): string {
  if (pathname.startsWith('/admin')) return '';
  const lane = getLane(pathname);
  if (lane === 'dental') return 'DENTAL PRACTICE';
  if (lane === 'medical') return 'OROFACIAL PAIN & ORAL MEDICINE';
  return 'EST. 1999 · RANCHO CUCAMONGA';
}
