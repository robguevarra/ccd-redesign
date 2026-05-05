function ts() {
  return new Date().toISOString().slice(11, 19);
}

export const log = {
  info: (msg: string) => console.log(`[${ts()}] ${msg}`),
  ok: (msg: string) => console.log(`[${ts()}] ✓ ${msg}`),
  warn: (msg: string) => console.warn(`[${ts()}] ⚠ ${msg}`),
  err: (msg: string) => console.error(`[${ts()}] ✗ ${msg}`),
  step: (n: number | string, msg: string) => console.log(`[${ts()}] [${n}] ${msg}`),
};
