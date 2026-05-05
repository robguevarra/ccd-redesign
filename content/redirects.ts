import type { Redirect } from './schemas';

/**
 * 301 / 410 redirect map for the dentisthsu.com migration.
 *
 * Consumed by `vercel.ts` `redirects` config in P4. Each redirect has a
 * stable canonical destination so SEO equity from the old WordPress URLs
 * transfers cleanly.
 *
 * Three redirect categories:
 *   1. Service slug normalization      (`/services-X-html` -> `/services/X`)
 *   2. Page consolidation               (testimonials, financing, contact, etc.)
 *   3. Zombie / theme-demo deletion     (410 Gone preferred over 301)
 *
 * See: docs/superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md §8
 *      docs/ia/redirects.md (human-readable mirror)
 */
export const redirects: Redirect[] = [
  // ------------------------------------------------------------------
  // 1. Service slug normalization (-html legacy permalinks)
  // ------------------------------------------------------------------
  { from: '/services-compositefillings-html', to: '/services/composite-fillings', status: 301, note: 'WP permalink legacy' },
  { from: '/services-rootcanaltherapy-html', to: '/services/root-canal-therapy', status: 301 },
  { from: '/services-pediatricoralhealthcare-html', to: '/services/children-oral-healthcare', status: 301, note: 'Slug + naming' },
  { from: '/services-porcelainveneers-html', to: '/services/porcelain-veneers', status: 301 },
  { from: '/services-sleepapneatreatment-html', to: '/services/sleep-apnea', status: 301, note: 'Slug + simplification' },
  { from: '/services-teethextractions-html', to: '/services/tooth-extractions', status: 301 },
  { from: '/services-removableorthodontics-html', to: '/services/removable-orthodontics', status: 301 },
  { from: '/services-fixedbridges-html', to: '/services/fixed-bridges', status: 301 },
  { from: '/services-laserdentistry-html', to: '/services/periodontal-treatment', status: 301, note: 'Laser dentistry consolidates into periodontal' },
  { from: '/services-orthodontics-html', to: '/services/orthodontics', status: 301 },
  { from: '/services-oralhygiene-html', to: '/services/oral-hygiene', status: 301 },
  { from: '/services-periodontaltreatment-html', to: '/services/periodontal-treatment', status: 301 },
  { from: '/services-implants-html', to: '/services/dental-implants', status: 301, note: 'New service in v2 IA' },
  { from: '/services-onlays-html', to: '/services/crowns-caps', status: 301, note: 'Onlays merge into crowns category' },
  { from: '/services-dentures-html', to: '/services/dentures', status: 301 },
  { from: '/services-sedationdentistry-html', to: '/services/sedation-dentistry', status: 301 },

  // ------------------------------------------------------------------
  // 2. Page consolidation
  // ------------------------------------------------------------------
  // Testimonials -> /reviews
  { from: '/testimonial-ali', to: '/reviews', status: 301 },
  { from: '/testimonial-anon', to: '/reviews', status: 301 },
  { from: '/testimonial-anthony-a', to: '/reviews', status: 301 },
  { from: '/testimonial-baby-m', to: '/reviews', status: 301 },
  { from: '/testimonial-cat-h', to: '/reviews', status: 301 },
  { from: '/testimonial-d-j', to: '/reviews', status: 301 },
  { from: '/testimonial-danny-c', to: '/reviews', status: 301 },
  { from: '/testimonial-g-c', to: '/reviews', status: 301 },
  { from: '/testimonial-g-m', to: '/reviews', status: 301 },
  { from: '/testimonial-g-s', to: '/reviews', status: 301 },
  { from: '/testimonial-gg-mitrescu', to: '/reviews', status: 301 },
  { from: '/testimonial-jen-c', to: '/reviews', status: 301 },
  { from: '/testimonial-jenny-h', to: '/reviews', status: 301 },
  { from: '/testimonial-jerry-g', to: '/reviews', status: 301 },
  { from: '/testimonial-john-d', to: '/reviews', status: 301 },
  { from: '/testimonial-juice-m', to: '/reviews', status: 301 },
  { from: '/testimonial-mary-s', to: '/reviews', status: 301 },
  { from: '/testimonial-melissa-b', to: '/reviews', status: 301 },
  { from: '/testimonial-michael-s', to: '/reviews', status: 301 },
  { from: '/testimonial-nathan-fields', to: '/reviews', status: 301 },
  { from: '/testimonial-p-c', to: '/reviews', status: 301 },
  { from: '/testimonial-peter-j', to: '/reviews', status: 301 },
  { from: '/testimonial-pvr', to: '/reviews', status: 301 },
  { from: '/testimonial-sam-d', to: '/reviews', status: 301 },
  { from: '/testimonial-tina-p', to: '/reviews', status: 301 },
  { from: '/testimonial-w-mamba', to: '/reviews', status: 301 },
  { from: '/testimonial_group/group-1', to: '/reviews', status: 301 },
  { from: '/testimonial_group/group-2-with-image', to: '/reviews', status: 301 },

  // Doctor pages
  { from: '/about-our-dentist-brien-hsu-dds', to: '/doctors/dr-brien-hsu', status: 301 },
  { from: '/doctors-dr-brien-hsu', to: '/doctors/dr-brien-hsu', status: 301 },
  { from: '/doctors-dr-angela-huang', to: '/doctors/dr-angela-huang', status: 301 },
  { from: '/doctors-dr-earlene-milone-2', to: '/doctors/dr-amandeep-singh', status: 301, note: 'Old WP slug was for prior associate; current doctor is Dr. Singh' },
  { from: '/doctors-dr-rachel-lim', to: '/doctors/dr-rachel-lim', status: 301 },
  { from: '/doctors-dr-robert-sharobiem', to: '/doctors/dr-robert-sharobiem', status: 301 },
  { from: '/doctors-dr-serena-hsu', to: '/doctors/dr-serena-hsu', status: 301 },
  { from: '/aboutus-associates-html', to: '/doctors', status: 301 },
  { from: '/our-team', to: '/doctors', status: 301 },
  { from: '/aboutus-interview-html', to: '/about', status: 301 },
  { from: '/aboutus-virtualofficetour-html', to: '/about', status: 301 },
  { from: '/interview-with-our-dentist', to: '/about', status: 301 },
  { from: '/interview', to: '/about', status: 301 },
  { from: '/about-us-2', to: '/about', status: 301 },
  { from: '/associate-of-dr-brien-hsu', to: '/doctors', status: 301 },
  { from: '/author-brienhsu', to: '/doctors/dr-brien-hsu', status: 301 },

  // Financing
  { from: '/financing-easyfinancing-html', to: '/financing', status: 301 },
  { from: '/financing-financing-html', to: '/financing', status: 301 },
  { from: '/financing-index-html', to: '/financing', status: 301 },
  { from: '/images-carecredit2-pdf', to: '/financing', status: 301 },

  // Contact
  { from: '/contact-directions-html', to: '/contact', status: 301 },
  { from: '/contact-patientforms-html', to: '/contact', status: 301 },
  { from: '/patient-forms', to: '/contact', status: 301 },
  { from: '/appointments', to: '/request-appointment', status: 301 },

  // Technology consolidation
  { from: '/3shape-trios', to: '/technology', status: 301 },
  { from: '/zeiss-dental-microscope', to: '/technology', status: 301 },
  { from: '/i-cat-flx-3d-cone-beam-computed-tomography-cbct-system', to: '/technology', status: 301 },
  { from: '/2019-10-3-shape-html', to: '/technology', status: 301 },
  { from: '/2015-11-3d-cone-beam-ct-technology-html', to: '/technology', status: 301 },
  { from: '/new-technology-in-preparation-for-2024', to: '/technology', status: 301 },
  { from: '/cbct-accreditation', to: '/technology', status: 301 },

  // Portfolio -> service detail (case-by-case mapping)
  { from: '/portfolio-composite-fillings', to: '/services/composite-fillings', status: 301 },
  { from: '/portfolio-dental-implants-2', to: '/services/dental-implants', status: 301 },
  { from: '/portfolio-fixed-bridges', to: '/services/fixed-bridges', status: 301 },
  { from: '/portfolio-onlays', to: '/services/crowns-caps', status: 301 },
  { from: '/portfolio-oral-hygiene', to: '/services/oral-hygiene', status: 301 },
  { from: '/portfolio-veneers-lumineers', to: '/services/porcelain-veneers', status: 301 },
  { from: '/portfolio-crowns-caps', to: '/services/crowns-caps', status: 301 },
  { from: '/portfolio', to: '/services', status: 301 },
  { from: '/deep-bleaching-results-gallery', to: '/services/teeth-whitening', status: 301 },

  // Personal/family content -> /about (community section); v2 may relocate
  { from: '/2011-12-november-30th-wind-storm-html', to: '/about', status: 301, note: 'Personal content; v2 may move to separate namespace' },
  { from: '/the-happiest-and-saddest-day-of-our-lives-entry-3', to: '/about', status: 301 },
  { from: '/pre-labor-surprise-entry-1', to: '/about', status: 301 },
  { from: '/hanna-hsu-update', to: '/about', status: 301 },
  { from: '/2017-02-in-memory-of-dr-william-wei-hsu-html', to: '/about', status: 301 },
  { from: '/in-memory-of-dr-william-wei-hsu', to: '/about', status: 301 },
  { from: '/childrens-hospital-los-angeles-cticu-entry-4', to: '/about', status: 301 },
  { from: '/2011-10-childrens-hospital-los-angeles-cticu-html', to: '/about', status: 301 },
  { from: '/rough-night-at-the-hospital-entry-2', to: '/about', status: 301 },
  { from: '/memories-about-children-dentistry', to: '/about', status: 301 },

  // Volunteer / community content -> /about
  { from: '/covid-19-vaccination', to: '/about', status: 301 },
  { from: '/san-bernardino-free-outreach-clinic', to: '/about', status: 301 },
  { from: '/2017-02-give-kids-smile-ada-foundation-html', to: '/about', status: 301 },
  { from: '/2014-04-giving-back-to-volunteers-html', to: '/about', status: 301 },

  // Substantive blog posts retained in /blog (slug normalization for some)
  { from: '/the-truth-about-white-fillings', to: '/blog/the-truth-about-white-fillings', status: 301 },
  { from: '/dangers-of-whitening-toothpaste', to: '/blog/dangers-of-whitening-toothpaste', status: 301 },

  // ------------------------------------------------------------------
  // 3. Zombie / theme-demo / lorem ipsum -> 410 Gone
  // ------------------------------------------------------------------
  { from: '/hello-world', to: '/', status: 410, note: 'Default WordPress post' },
  { from: '/hello-world-2', to: '/', status: 410 },
  { from: '/hello-world-2-2', to: '/', status: 410 },
  { from: '/lorem-simply-dummy-text-the-industry', to: '/', status: 410, note: 'Theme demo' },
  { from: '/it-uses-a-dictionary-of-over-200-latin-words', to: '/', status: 410 },
  { from: '/latin-words-comined-handful-of-mode', to: '/', status: 410 },
  { from: '/email-quotes-and-inclusion-conventions', to: '/', status: 410 },
  { from: '/research-paper-topics-tips-to-choosing-the-ideal-issue', to: '/', status: 410 },
  { from: '/button', to: '/', status: 410, note: 'Theme component demo' },
  { from: '/message-box', to: '/', status: 410 },
  { from: '/three-col-wide', to: '/', status: 410 },
  { from: '/four-column-services', to: '/', status: 410 },
  { from: '/three-column-services', to: '/', status: 410 },
  { from: '/two-column-services', to: '/', status: 410 },
  { from: '/blog-2-column', to: '/', status: 410 },
  { from: '/blog-3-column', to: '/', status: 410 },
  { from: '/blog-4-column', to: '/', status: 410 },
  { from: '/blog-html', to: '/', status: 410 },
  { from: '/blog-left-sidebar', to: '/', status: 410 },
  { from: '/blog-right-sidebar', to: '/', status: 410 },
  { from: '/blog-right-sidebar-2', to: '/', status: 410 },
  { from: '/both-sidebar-at-left', to: '/', status: 410 },
  { from: '/both-sidebar-at-right', to: '/', status: 410 },
  { from: '/page-with-both-sidebar', to: '/', status: 410 },
  { from: '/page-with-left-sidebar', to: '/', status: 410 },
  { from: '/page-with-right-sidebar', to: '/', status: 410 },
  { from: '/left-sidebar', to: '/', status: 410 },
  { from: '/image-gallery', to: '/', status: 410 },
  { from: '/case-study', to: '/', status: 410 },
  { from: '/general-service', to: '/', status: 410 },
  { from: '/wds-slider-preview', to: '/', status: 410 },
  { from: '/section-dental', to: '/', status: 410 },
  { from: '/section-medical', to: '/', status: 410 },
  { from: '/personal-blog', to: '/', status: 410 },
  { from: '/1691-2', to: '/', status: 410, note: 'Numeric ID stub' },
  { from: '/2121-2', to: '/', status: 410 },
  { from: '/2249-2', to: '/', status: 410 },

  // Yoast XML sitemaps that were indexed as HTML
  { from: '/sitemap-index-xml', to: '/', status: 410, note: 'Yoast XML indexed as HTML' },
  { from: '/page-sitemap-xml', to: '/', status: 410 },
  { from: '/post-sitemap-xml', to: '/', status: 410 },
  { from: '/category-sitemap-xml', to: '/', status: 410 },
  { from: '/portfolio-sitemap-xml', to: '/', status: 410 },
  { from: '/team-group-sitemap-xml', to: '/', status: 410 },
  { from: '/team-member-sitemap-xml', to: '/', status: 410 },
  { from: '/testimonial-group-sitemap-xml', to: '/', status: 410 },
  { from: '/testimonial-sitemap-xml', to: '/', status: 410 },
  { from: '/wds-slider-sitemap-xml', to: '/', status: 410 },
  { from: '/post-tag-sitemap-xml', to: '/', status: 410 },

  // WordPress archive collapse
  { from: '/category/dental-blog', to: '/blog', status: 301 },
  { from: '/category/personal-blog', to: '/blog', status: 301 },
  { from: '/category-dental-blog', to: '/blog', status: 301 },
  { from: '/category-personal-blog', to: '/blog', status: 301 },
  { from: '/tag-general', to: '/blog', status: 301 },
  { from: '/tag-information', to: '/blog', status: 301 },

  // FAQ (deferred decision; preserve route)
  { from: '/faq', to: '/contact', status: 301, note: 'Stub today; consider rebuilding in v2' },

  // ------------------------------------------------------------------
  // 4. Subdomain consolidation (also configured at DNS in v2 deployment)
  // ------------------------------------------------------------------
  // Note: cross-domain redirects must be configured at DNS / Vercel domain
  // level, not in vercel.ts redirects. Listed here for documentation.
  // 2017.dentisthsu.com/*           -> https://dentisthsu.com/
  // www.blog.dentisthsu.com/*       -> https://dentisthsu.com/
  // www.familyblog.dentisthsu.com/* -> https://dentisthsu.com/
];
