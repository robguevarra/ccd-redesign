/**
 * Resolves the lane-aware sub-label shown beneath the wordmark in the header.
 * Pure pathname → string mapping; safe to call from server or client. Currently
 * consumed in `<SiteHeader>` (a client component) via `usePathname()`.
 *
 * See: docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md §3
 */
export function getSublabel(pathname: string): string {
  if (pathname.startsWith('/dental')) return 'DENTAL PRACTICE';
  if (pathname.startsWith('/medical')) return 'OROFACIAL PAIN & ORAL MEDICINE';
  if (pathname.startsWith('/admin')) return '';
  return 'EST. 1999 · RANCHO CUCAMONGA';
}
