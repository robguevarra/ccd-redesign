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

/* ---- Service category covers (used on /services overview) ---- */

export const serviceCategoryCovers: Record<string, CuratedImage> = {
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
  specialty: {
    src: u('1551601651-2a8555f1a136'),
    alt: 'A clinician in PPE working with focused light',
    credit: 'CDC / Unsplash',
  },
  orthodontics: {
    src: u('1622253692010-333f2da6031d'),
    alt: 'A close-up of orthodontic work',
    credit: 'Diana Polekhina / Unsplash',
  },
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
    src: u('1583912267550-3b9e6e8b0ff9'),
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
    src: u('1606811951341-6b5f59d1bd44'),
    alt: 'A patient profile showing the jawline area',
    credit: 'Diana Polekhina / Unsplash',
  } satisfies CuratedImage,
  scan: {
    src: u('1583912267550-3b9e6e8b0ff9'),
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

/* ---- Doctor placeholder portraits — until the real session ---- */

export const doctorPlaceholders = {
  'dr-brien-hsu': {
    src: u('1612531386530-97286d97c2d2'),
    alt: 'A clinician in a clinical setting',
    credit: 'Usman Yousaf / Unsplash',
  } satisfies CuratedImage,
  'dr-angela-huang': {
    src: u('1559839734-2b71ea197ec2'),
    alt: 'A doctor in a clinic setting',
    credit: 'Christina @ wocintechchat / Unsplash',
  } satisfies CuratedImage,
  'dr-amandeep-singh': {
    src: u('1622253692010-333f2da6031d'),
    alt: 'A clinician at work',
    credit: 'Diana Polekhina / Unsplash',
  } satisfies CuratedImage,
  'dr-rachel-lim': {
    src: u('1559839734-2b71ea197ec2'),
    alt: 'A doctor in a clinic setting',
    credit: 'Christina @ wocintechchat / Unsplash',
  } satisfies CuratedImage,
  'dr-robert-sharobiem': {
    src: u('1612531386530-97286d97c2d2'),
    alt: 'A clinician in a clinical setting',
    credit: 'Usman Yousaf / Unsplash',
  } satisfies CuratedImage,
  'dr-serena-hsu': {
    src: u('1559839734-2b71ea197ec2'),
    alt: 'A doctor in a clinic setting',
    credit: 'Christina @ wocintechchat / Unsplash',
  } satisfies CuratedImage,
};
