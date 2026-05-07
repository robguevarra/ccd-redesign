/**
 * One-off image optimizer. Converts PNG sources in `public/` to WebP, which
 * Next.js's <Image> still optimizes further at delivery (AVIF/WebP variants
 * via the loader). Smaller source = faster cold-cache responses + smaller
 * repo + faster Vercel builds.
 *
 * Run: pnpm exec node scripts/optimize-images.mjs
 *
 * Quality: 85 (high-fidelity lossy — perceptually identical to the source
 * for portrait photography, ~10-15× smaller than PNG).
 */
import { readdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const TARGETS = [
  'public/logo.png',
  ...await readdir('public/images/doctors').then((files) =>
    files
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .map((f) => `public/images/doctors/${f}`),
  ),
];

const QUALITY = 85;

let totalIn = 0;
let totalOut = 0;

console.log(`Converting ${TARGETS.length} files to WebP @ q${QUALITY}\n`);

for (const path of TARGETS) {
  const sizeIn = (await stat(path)).size;
  totalIn += sizeIn;

  const outPath = path.replace(/\.png$/i, '.webp');
  await sharp(path).webp({ quality: QUALITY, effort: 6 }).toFile(outPath);

  const sizeOut = (await stat(outPath)).size;
  totalOut += sizeOut;

  const fmt = (b) => `${(b / 1024).toFixed(0).padStart(6)} KB`;
  const ratio = ((1 - sizeOut / sizeIn) * 100).toFixed(1);
  console.log(`${fmt(sizeIn)} → ${fmt(sizeOut)}  (-${ratio}%)  ${basename(outPath)}`);
}

const fmtMb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;
console.log(`\nTotal: ${fmtMb(totalIn)} → ${fmtMb(totalOut)} (saved ${fmtMb(totalIn - totalOut)})`);
