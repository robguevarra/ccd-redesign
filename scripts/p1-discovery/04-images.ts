import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { dirname, basename, extname } from 'node:path';
import sharp from 'sharp';
import { sourcePaths } from './lib/paths';
import { log } from './lib/logger';

const MD_IMG = /!\[([^\]]*)\]\(([^)]+)\)/g;

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

interface ImageRecord {
  page: string;
  sourceUrl: string;
  localPath: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

async function main() {
  const pagesDir = sourcePaths().source + '/pages';
  const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.md'));
  const inventory: ImageRecord[] = [];

  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    const md = await readFile(`${pagesDir}/${f}`, 'utf8');
    const dir = sourcePaths(slug).imageDir!;
    await mkdir(dir, { recursive: true });

    const matches = [...md.matchAll(MD_IMG)];
    log.step('04', `${slug}: ${matches.length} images`);

    for (const m of matches) {
      const [, alt = '', src = ''] = m;
      if (!/^https?:/.test(src)) continue;
      const filename = basename(new URL(src).pathname) || `image${extname(src) || '.jpg'}`;
      const local = `${dir}/${filename}`;
      let bytes: number | undefined;
      let width: number | undefined;
      let height: number | undefined;
      let format: string | undefined;

      if (!(await fileExists(local))) {
        try {
          const res = await fetch(src);
          if (!res.ok) { log.warn(`fetch failed ${src} (${res.status})`); continue; }
          const buf = Buffer.from(await res.arrayBuffer());
          await writeFile(local, buf);
          bytes = buf.byteLength;
        } catch (e) {
          log.warn(`download error ${src}: ${String(e)}`);
          continue;
        }
      }

      try {
        const meta = await sharp(local).metadata();
        width = meta.width; height = meta.height; format = meta.format;
        if (bytes === undefined) bytes = (await readFile(local)).byteLength;
      } catch { /* non-image or corrupted; skip metadata */ }

      inventory.push({ page: slug, sourceUrl: src, localPath: local, alt, width, height, format, bytes });
    }
  }

  const out = `${sourcePaths().source}/image-index.json`;
  await writeFile(out, JSON.stringify({ generatedAt: new Date().toISOString(), images: inventory }, null, 2));
  log.ok(`Wrote ${out} — ${inventory.length} image records`);
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
