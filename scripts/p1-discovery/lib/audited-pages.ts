const PRIORITY_PATTERNS: Array<{ pattern: RegExp; weight: number }> = [
  { pattern: /^\/$/, weight: 100 },
  { pattern: /^\/services\/[^/]+$/, weight: 90 },
  { pattern: /^\/services\/?$/, weight: 85 },
  { pattern: /^\/doctor\/?$/, weight: 80 },
  { pattern: /^\/about\/?$/, weight: 75 },
  { pattern: /^\/contact\/?$/, weight: 70 },
  { pattern: /^\/request-appointment\/?$/, weight: 70 },
  { pattern: /^\/blog\/?$/, weight: 60 },
  { pattern: /^\/blog\/[^/]+$/, weight: 40 },
];

const EXCLUDE = /^\/(privacy|terms|sitemap|404|search|tag|category|author)/;

export function selectAuditedPages(urls: string[], cap = 12): string[] {
  const scored = urls
    .map((url) => {
      const path = new URL(url).pathname;
      if (EXCLUDE.test(path)) return null;
      const match = PRIORITY_PATTERNS.find((p) => p.pattern.test(path));
      return match ? { url, weight: match.weight, path } : null;
    })
    .filter((x): x is { url: string; weight: number; path: string } => x !== null)
    .sort((a, b) => b.weight - a.weight);

  // Cap blog posts at 2.
  const result: string[] = [];
  let blogPostCount = 0;
  for (const item of scored) {
    if (/^\/blog\/[^/]+$/.test(item.path)) {
      if (blogPostCount >= 2) continue;
      blogPostCount++;
    }
    result.push(item.url);
    if (result.length >= cap) break;
  }
  return result;
}
