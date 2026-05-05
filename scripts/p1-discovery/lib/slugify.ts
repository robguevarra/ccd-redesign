export function slugify(url: string): string {
  const parsed = new URL(url); // throws if invalid
  let path = parsed.pathname.replace(/\/+$/, '').replace(/^\/+/, '');
  if (path === '') return 'index';
  path = decodeURIComponent(path);
  return path
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
