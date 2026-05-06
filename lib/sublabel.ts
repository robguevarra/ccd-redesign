/**
 * Resolves the lane-aware sub-label shown beneath the wordmark in the header.
 * Server-side helper — call from layouts that have access to the request path.
 *
 * See: docs/superpowers/specs/2026-05-06-dentisthsu-pre-pitch-audit-pass.md §3
 */
export function getSublabel(pathname: string): string {
  if (pathname.startsWith('/dental')) return 'DENTAL PRACTICE';
  if (pathname.startsWith('/medical')) return 'OROFACIAL PAIN & ORAL MEDICINE';
  if (pathname.startsWith('/admin')) return '';
  return 'EST. 1999 · RANCHO CUCAMONGA';
}
