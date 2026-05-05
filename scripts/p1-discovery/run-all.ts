import { spawn } from 'node:child_process';
import { log } from './lib/logger';

const STEPS: Array<{ name: string; script: string }> = [
  { name: '01-discover', script: 'scripts/p1-discovery/01-discover.ts' },
  { name: '02-scrape', script: 'scripts/p1-discovery/02-scrape.ts' },
  { name: '03-extract-globals', script: 'scripts/p1-discovery/03-extract-globals.ts' },
  { name: '04-images', script: 'scripts/p1-discovery/04-images.ts' },
  { name: '05-screenshots', script: 'scripts/p1-discovery/05-screenshots.ts' },
  { name: '06-lighthouse', script: 'scripts/p1-discovery/06-lighthouse.ts' },
  { name: '07-axe', script: 'scripts/p1-discovery/07-axe.ts' },
];

function run(script: string): Promise<number> {
  return new Promise((resolve) => {
    const p = spawn('pnpm', ['exec', 'tsx', script], { stdio: 'inherit' });
    p.on('exit', (code) => resolve(code ?? 0));
  });
}

async function main() {
  for (const step of STEPS) {
    log.info(`==== ${step.name} ====`);
    const code = await run(step.script);
    if (code !== 0) {
      log.err(`${step.name} exited with code ${code} — halting`);
      process.exit(code);
    }
  }
  log.ok('All P1 discovery steps complete.');
}

main().catch((e) => { log.err(String(e)); process.exit(1); });
