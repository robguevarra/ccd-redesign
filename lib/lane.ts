/**
 * Resolves the current practice lane from the pathname. Used to drive the
 * `data-lane` attribute on themed islands (header, footer, route content)
 * and the `aria-current` state of the header's lane toggle.
 *
 * Pure function; safe to call from server or client. The lane is derived
 * from the URL — no cookie, no client state.
 *
 * See: docs/superpowers/specs/2026-05-16-dentisthsu-dual-identity-system.md §2.4
 */
export type Lane = 'dental' | 'medical' | 'neutral';

export function getLane(pathname: string): Lane {
  // Prefix match is strict on segment boundary: '/dental-clinic' must NOT
  // resolve to dental. We check that the next char (if any) is '/' or end.
  if (matchesSegment(pathname, '/dental')) return 'dental';
  if (matchesSegment(pathname, '/medical')) return 'medical';
  return 'neutral';
}

function matchesSegment(pathname: string, prefix: string): boolean {
  if (!pathname.startsWith(prefix)) return false;
  const next = pathname.charAt(prefix.length);
  return next === '' || next === '/';
}
