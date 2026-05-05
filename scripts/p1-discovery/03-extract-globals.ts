import { readFile, writeFile, readdir } from 'node:fs/promises';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

interface PageJson {
  url: string;
  slug: string;
  metadata: Record<string, unknown>;
  links: string[];
}

const PHONE_RE = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
const ADDRESS_HINTS = /\b(\d{1,5}\s+\w[\w\s.,'-]+(Avenue|Ave|Street|St|Blvd|Boulevard|Road|Rd|Drive|Dr|Lane|Ln|Way|Suite|Ste)\b)/i;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

async function main() {
  const pagesDir = sourcePaths().source + '/pages';
  const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.md'));
  log.step('03', `Extracting globals from ${files.length} pages`);

  const candidates = {
    phones: new Set<string>(),
    addresses: new Set<string>(),
    emails: new Set<string>(),
    socials: new Set<string>(),
  };

  for (const f of files) {
    const md = await readFile(`${pagesDir}/${f}`, 'utf8');
    md.match(new RegExp(PHONE_RE, 'g'))?.forEach((p) => candidates.phones.add(p.trim()));
    md.match(new RegExp(EMAIL_RE, 'g'))?.forEach((e) => candidates.emails.add(e.toLowerCase()));
    const addr = md.match(ADDRESS_HINTS);
    if (addr) candidates.addresses.add(addr[1]!.trim());

    const slug = f.replace(/\.md$/, '');
    const json = JSON.parse(await readFile(`${pagesDir}/${slug}.json`, 'utf8')) as PageJson;
    for (const l of json.links) {
      if (/(facebook|instagram|x\.com|twitter|youtube|linkedin|yelp|google)/i.test(l)) {
        candidates.socials.add(l);
      }
    }
  }

  const out = {
    target: 'https://dentisthsu.com',
    extractedAt: new Date().toISOString(),
    phones: [...candidates.phones],
    addresses: [...candidates.addresses],
    emails: [...candidates.emails],
    socials: [...candidates.socials],
    notes: 'Automated extraction. Verify and curate manually before consuming downstream.',
  };

  await writeFile(sourcePaths().practiceInfoJson, JSON.stringify(out, null, 2));
  log.ok(`Wrote practice-info.json — ${out.phones.length} phones, ${out.addresses.length} addresses, ${out.emails.length} emails, ${out.socials.length} socials`);
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
