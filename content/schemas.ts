/**
 * Content schemas for the dentisthsu.com pitch site.
 *
 * These types serve as the single contract between:
 *   - Supabase tables (P4 will write migrations matching these shapes)
 *   - MDX frontmatter validators for `content/services/*.mdx`, `content/doctors/*.mdx`
 *   - React component props in P4
 *
 * Storage strategy summary:
 *   Service              -> MDX in `content/services/<slug>.mdx`
 *   Doctor               -> MDX in `content/doctors/<slug>.mdx`
 *   BlogPost             -> Supabase `blog_posts` table   ⭐ admin-editable
 *   Review               -> JSON in `content/reviews.json`
 *   AppointmentRequest   -> Supabase `appointment_requests` table
 *   PracticeInfo         -> TS const in `content/practice-info.ts`
 *   MediaAsset           -> Supabase Storage + `media_assets` table
 *
 * See: docs/superpowers/specs/2026-05-05-dentisthsu-phase-2-ia-content-strategy.md §6
 */

export type ServiceLane = 'medical' | 'dental';

export type ServiceSubcategory =
  // Medical
  | 'tmj-orofacial-pain'
  | 'oral-medicine-pathology'
  | 'sleep-airway'
  | 'surgical-regenerative-medical'
  // Dental
  | 'preventive'
  | 'restorative'
  | 'endodontics'
  | 'oral-surgery-dental'
  | 'periodontal-surgical';

export type TechnologyRef = 'cbct' | 'trios' | 'zeiss-microscope' | 'laser';

export interface Image {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Service {
  slug: string;
  name: string;
  lane: ServiceLane;
  subcategory: ServiceSubcategory;
  /** 1–2 sentences. Used on lane landing cards and meta description. */
  summary: string;
  hero?: Image;
  /** True only for the wow-zone signature service (TMJ). Flips template variant. */
  signature?: boolean;
  /** Surfaces this service on `/technology` page when array contains items. */
  technologyRefs?: TechnologyRef[];
  /** MDX-rendered body content. */
  body: string;
}

export interface Doctor {
  /** URL slug, e.g. 'dr-brien-hsu'. */
  slug: string;
  name: string;
  /** e.g. 'DDS', 'Lead Clinician', 'DMD'. */
  title: string;
  portrait: Image;
  /** 1-paragraph blurb for `/doctors` index. */
  short: string;
  /** MDX long-form bio. */
  bio: string;
  specialties: string[];
  /** Year joined the practice. 1999 for Brien Hsu. */
  joinedYear: number;
  isLead: boolean;
}

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  /** uuid v4 */
  id: string;
  slug: string;
  title: string;
  status: BlogPostStatus;
  /** ISO timestamp; null when status is 'draft'. */
  publishedAt: string | null;
  /** Foreign key to `Doctor.slug`. */
  authorDoctorSlug: string;
  hero: Image | null;
  excerpt: string;
  /** Raw MDX-compatible markdown produced by the Tiptap editor. */
  bodyMdx: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ReviewSource = 'google' | 'yelp' | 'facebook';

export interface Review {
  id: string;
  source: ReviewSource;
  authorName: string;
  /** e.g. 'M.B.' — rendered when the reviewer requested anonymity. */
  authorInitial: string | null;
  /** We curate only 5-star reviews. */
  rating: 5;
  body: string;
  sourceUrl: string;
  /** True = surfaced on the homepage. */
  featured: boolean;
  /** Sort order for `/reviews`. */
  order: number;
}

export type AppointmentPreferredTime = 'morning' | 'afternoon' | 'either';
export type AppointmentStatus = 'new' | 'contacted' | 'closed';

export interface AppointmentRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredTime: AppointmentPreferredTime;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string;
}

export interface BusinessHours {
  /** 'Monday' | 'Tuesday' | … | 'Sunday'. */
  day: string;
  /** 'HH:MM' 24h. Empty when closed. */
  open: string;
  close: string;
  closed?: boolean;
}

export interface PhoneNumber {
  /** Display label, e.g. 'Main', 'Toll-free'. */
  label: string;
  /** Display format, e.g. '(909) 558-8187'. */
  number: string;
  /** tel: href value, e.g. '+19095588187'. */
  tel: string;
}

export interface PracticeInfo {
  /** Public-facing brand name. */
  brandName: string;
  /** Legal/professional entity name. */
  legalName: string;
  address: { street: string; city: string; state: string; zip: string };
  hours: BusinessHours[];
  phones: PhoneNumber[];
  email: string | null;
  socials: {
    facebook?: string;
    yelp?: string;
    twitter?: string;
    google?: string;
    instagram?: string;
  };
  /** True iff the practice is set up to surface CareCredit / financing options. */
  taxIdEnabledForFinancing: boolean;
}

export type MediaFormat = 'avif' | 'webp' | 'jpeg' | 'png';

export interface MediaAsset {
  id: string;
  /** Supabase Storage object key. */
  storagePath: string;
  publicUrl: string;
  alt: string | null;
  width: number;
  height: number;
  format: MediaFormat;
  bytes: number;
  /** Doctor slug who uploaded the asset. */
  uploadedBy: string;
  createdAt: string;
}

/** ----- 301 / 410 redirect map shape (consumed by `vercel.ts` in P4). ----- */

export type RedirectStatus = 301 | 410;

export interface Redirect {
  /**
   * Source path, no domain. Either an exact path or a Next.js path-pattern.
   * For 410s the destination is unused but kept for documentation.
   */
  from: string;
  /** Destination path. For 410, leave as '/' (Next.js requires a destination). */
  to: string;
  status: RedirectStatus;
  /** Documentation hint — why this redirect exists. */
  note?: string;
}
