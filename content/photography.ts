/**
 * Curated editorial photography for the pitch.
 *
 * Source: Unsplash (free commercial use). Each entry pairs a stable Unsplash
 * photo URL with attribution and a controlled grade/tone direction. For v2
 * launch we replace these with the practice's own photo session per master
 * spec [§5 photography direction option E].
 */

export interface CuratedImage {
  src: string;
  alt: string;
  /** Photographer credit for /reviews-style attribution if displayed. */
  credit: string;
}

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ---- Service category covers (used on /services overview) ----
 *
 * Each category cover may be either a CuratedImage or `null` (renders as a
 * typography-led gradient placeholder). Covers are nullable on purpose
 * because Unsplash content for our queries is unreliable — better to show
 * an honest placeholder than off-brand stock photography.
 */

export const serviceCategoryCovers: Record<string, CuratedImage | null> = {
  general: {
    src: u('1606811971618-4486d14f3f99'),
    alt: 'Hands holding a precision dental tool, soft daylight',
    credit: 'Caroline LM / Unsplash',
  },
  cosmetic: {
    src: u('1581595220892-b0739db3ba8c'),
    alt: 'A bright editorial portrait of an open mouth being examined',
    credit: 'Daniel Frank / Unsplash',
  },
  // Specialty + Orthodontics use gradient placeholders — the available
  // Unsplash stock content for these categories isn't on-brand.
  specialty: null,
  orthodontics: null,
};

/* ---- Hero supporting / section break imagery ---- */

export const editorialPhotos = {
  officeInterior: {
    src: u('1629909613654-28e377c37b09'),
    alt: 'A modern dental office interior with daylight',
    credit: 'Quang Tri Nguyen / Unsplash',
  } satisfies CuratedImage,
  instrumentsTray: {
    src: u('1629909613654-28e377c37b09'),
    alt: 'Dental instruments laid out on a tray',
    credit: 'Quang Tri Nguyen / Unsplash',
  } satisfies CuratedImage,
  cbctScanner: {
    src: u('1576091160550-2173dba999ef'),
    alt: '3D imaging equipment in a clinical setting',
    credit: 'NCI / Unsplash',
  } satisfies CuratedImage,
  trios: {
    src: u('1606811841689-23dfddce3e95'),
    alt: 'A handheld scanner being used on a patient',
    credit: 'Caroline LM / Unsplash',
  } satisfies CuratedImage,
  microscope: {
    src: u('1576091160550-2173dba999ef'),
    alt: 'A surgical microscope, close detail',
    credit: 'Robina Weermeijer / Unsplash',
  } satisfies CuratedImage,
  patientPortrait: {
    src: u('1559757148-5c350d0d3c56'),
    alt: 'A confident patient portrait, editorial framing',
    credit: 'Christina @ wocintechchat / Unsplash',
  } satisfies CuratedImage,
};

/* ---- TMJ signature page imagery ---- */

export const tmjImages = {
  hero: {
    src: u('1559757148-5c350d0d3c56', 2400),
    alt: 'A patient portrait, editorial framing',
    credit: 'Christina @ wocintechchat / Unsplash',
  } satisfies CuratedImage,
  scan: {
    src: u('1576091160550-2173dba999ef'),
    alt: 'A 3D dental imaging scan visualization',
    credit: 'NCI / Unsplash',
  } satisfies CuratedImage,
  consultation: {
    src: u('1576091160399-112ba8d25d1d'),
    alt: 'A doctor and patient in consultation',
    credit: 'National Cancer Institute / Unsplash',
  } satisfies CuratedImage,
  treatment: {
    src: u('1629909613654-28e377c37b09'),
    alt: 'Treatment in progress',
    credit: 'Quang Tri Nguyen / Unsplash',
  } satisfies CuratedImage,
};

/* Doctor portraits live in `content/doctors.ts` (`portrait` field) and point
 * to real PNG photos in `public/images/doctors/`. The placeholder map that
 * used to live here was retired once the practice provided real headshots. */
