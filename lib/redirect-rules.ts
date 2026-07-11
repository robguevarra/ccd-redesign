import { redirects } from '../content/redirects';

/**
 * Build-time resolver for the migration redirect map.
 *
 * `content/redirects.ts` is allowed to chain (legacy WP URL -> intermediate
 * pitch-era URL -> final lane URL) because the map was authored in phases.
 * Chains must not reach the browser — every legacy URL gets exactly one hop:
 *
 *   - chains ending on a live route  -> single 301 (Next `redirects()`)
 *   - chains ending on a 410 rule    -> 410 Gone (served by `proxy.ts`,
 *     because Next `redirects()` cannot emit 410)
 *
 * Relative import (not `@/`) so `next.config.ts` can consume this module.
 */

type FlattenedRule =
  | { from: string; to: string; status: 301 }
  | { from: string; status: 410 };

function flatten(): FlattenedRule[] {
  const byFrom = new Map(redirects.map((r) => [r.from, r]));

  return redirects.map((rule) => {
    let current = rule;
    const seen = new Set<string>([rule.from]);

    while (current.status !== 410) {
      const next = byFrom.get(current.to);
      if (!next) break;
      if (seen.has(next.from)) {
        throw new Error(`Redirect loop detected starting at ${rule.from}`);
      }
      seen.add(next.from);
      current = next;
    }

    return current.status === 410
      ? { from: rule.from, status: 410 }
      : { from: rule.from, to: current.to, status: 301 };
  });
}

const flattened = flatten();

/** 301 rules in the shape `next.config.ts` `redirects()` expects. */
export const permanentRedirects = flattened
  .filter((r): r is Extract<FlattenedRule, { status: 301 }> => r.status === 301)
  .map((r) => ({ source: r.from, destination: r.to, permanent: true }));

/** Paths that must answer 410 Gone (zombie WP content, dropped services). */
export const gonePaths: ReadonlySet<string> = new Set(
  flattened.filter((r) => r.status === 410).map((r) => r.from),
);
