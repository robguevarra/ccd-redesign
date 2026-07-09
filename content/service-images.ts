/**
 * Educational 3D illustrations, one per service.
 *
 * Generated with Higgsfield "Nano Banana Pro" (Google) as a consistent set of
 * clean anatomical / patient-education renders on a neutral background. Each
 * service slug maps to `public/images/services/educational/<slug>.png`.
 *
 * These are a v1 placeholder set; the practice will request tweaks later.
 * Source PNGs are 3:2, ~2k–4k. `next/image` handles responsive resizing and
 * WebP/AVIF conversion at serve time.
 *
 * The allowlist below is intentionally explicit: a service without a generated
 * illustration renders no figure rather than a broken image.
 */

/** Slugs that have a generated educational illustration on disk. */
export const SERVICE_ILLUSTRATION_SLUGS: ReadonlySet<string> = new Set([
  'alveoloplasty',
  'apicoectomy',
  'arthrocentesis',
  'biopsies',
  'bone-grafting',
  'composite-fillings',
  'comprehensive-exam',
  'crown-lengthening',
  'crowns-and-bridges',
  'custom-orthotic-device',
  'dentures',
  'direct-composite-veneers',
  'extractions',
  'fluoride-sealants',
  'frenectomy',
  'gingivectomy',
  'implants',
  'myofascial-pain-therapy',
  'neuropathic-pain',
  'occlusal-splints',
  'onlays',
  'oral-cancer-screening',
  'oral-cancer-shields',
  'oral-pathology',
  'orofacial-pain',
  'osteonecrosis',
  'periodontal-treatment',
  'porcelain-veneers',
  'prf-prp-injections',
  'professional-cleaning',
  'root-canal',
  'root-canal-retreatment',
  'scaling-root-planing',
  'sleep-apnea',
  'laser-photobiomodulation',
  'teeth-whitening',
  'tmj',
  'tongue-tie-release',
  'trigger-point-injections',
  'ultrasound-guided-procedures',
]);

/** Intrinsic aspect ratio of every generated illustration (3:2). */
export const SERVICE_ILLUSTRATION_RATIO = { width: 1200, height: 800 } as const;

/**
 * Optional second illustration for services that need two figures.
 * Dentures & Partial Dentures shows both appliance types (client request:
 * "dentures and partial dentures should be two different images").
 *
 * `anchor` places the figure inside the body copy, right after the first
 * paragraph containing that phrase (client: "the partial denture image
 * should go next to the partial denture section"). Without an anchor the
 * figure renders under the primary illustration at the top.
 */
export const SERVICE_SECONDARY_ILLUSTRATIONS: Record<
  string,
  { src: string; caption: string; anchor?: string }
> = {
  dentures: {
    src: '/images/services/educational/dentures-partial.png',
    caption: 'a removable partial denture with a metal clasp framework',
    anchor: 'Partial dentures replace',
  },
};

/**
 * Public path to a service's educational illustration, or `null` if the service
 * has no generated illustration yet.
 */
export function serviceIllustrationSrc(slug: string): string | null {
  return SERVICE_ILLUSTRATION_SLUGS.has(slug)
    ? `/images/services/educational/${slug}.png`
    : null;
}
