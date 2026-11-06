import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

/**
 * Guards the logo morph sprites against two past pixelation bugs:
 *  - too big: browsers use fast bilinear sampling while an image animates, which
 *    aliases past ~2× downscale (header mark looked jagged, then snapped crisp).
 *  - too small: a frame smaller than the display upscales and blurs on DPR-3
 *    phones (the old 240px cold-open strip).
 * If a display size changes, regenerate the sprite for it from the 2500px frames.
 */
const COLS = 6;
const ROWS = 5;
const root = process.cwd();

function pngSize(path: string) {
  const b = readFileSync(join(root, path));
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}
function source(path: string) {
  return readFileSync(join(root, path), 'utf8');
}
function spritePath(component: string, name = 'SPRITE') {
  const m = source(component).match(new RegExp(`const ${name} = '([^']+)'`));
  return `public${m![1]}`;
}
function displaySize(file: string, tag: string) {
  const m = source(file).match(new RegExp(`<${tag}[\\s\\S]*?size=\\{(\\d+)\\}`));
  return Number(m![1]);
}

const cases = [
  {
    name: 'header mark',
    component: 'components/lane-mark.tsx',
    display: displaySize('components/site-header.tsx', 'LaneMark'),
  },
  {
    name: 'homepage cold-open mark',
    component: 'components/logo-frames.tsx',
    display: displaySize('components/home-cold-open-cinematic.tsx', 'LogoFrames'),
  },
];

describe.each(cases)('$name morph sprite', ({ component, display }) => {
  const { width, height } = pngSize(spritePath(component));
  const frame = width / COLS;

  test('is an exact grid of square frames', () => {
    expect(Number.isInteger(frame)).toBe(true);
    expect(height / ROWS).toBe(frame);
  });

  test('never upscales on a DPR-3 phone', () => {
    expect(frame).toBeGreaterThanOrEqual(display * 3);
  });

  test('stays within a 2× downscale on DPR-2 screens', () => {
    expect(frame / (display * 2)).toBeLessThanOrEqual(2);
  });

  test('has a 1× sprite within a 2× downscale that never upscales', () => {
    const oneX = pngSize(spritePath(component, 'SPRITE_1X')).width / COLS;
    expect(oneX).toBeGreaterThanOrEqual(display);
    expect(oneX / display).toBeLessThanOrEqual(2);
  });

  test('renders as a raster, never a CSS mask', () => {
    expect(source(component)).not.toMatch(/mask(Image|Size|Position)?\s*:/);
  });
});
