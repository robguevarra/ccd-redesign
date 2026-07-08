/**
 * Before & After smile cases. Real patient photos supplied by the practice
 * (Smile Gallery refresh). Anonymous intraoral close-ups, all uniform 16:9
 * and consistently framed, so the slider shows them full-frame with no
 * per-image zoom/position adjustments.
 *
 * WebP optimized + LQIP blur generated from the supplied PNGs. Rendered with
 * the interactive <BeforeAfterSlider>.
 */

export interface BeforeAfterImage {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  /** Optional extra zoom (object-cover scale), e.g. 1.25 to crop in tighter. */
  scale?: number;
  /** Optional object-position override, e.g. 'center 35%'. Defaults to center. */
  objectPosition?: string;
}

export interface BeforeAfterCase {
  slug: string;
  before: BeforeAfterImage;
  after: BeforeAfterImage;
}

// NOTE (July 2026): the client-supplied "BeforeAfterPT1-2" photos turned out
// to be the same two cases already in this set (case-1 and case-2 below), so
// no new entries were added — adding them again duplicated rows 1&2 as 3&4.
export const beforeAfterCases: BeforeAfterCase[] = [
  {
    slug: 'case-1',
    before: {
      src: '/images/before-after/case-1-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAACQAQCdASoQAAkABABoJQBOgBOkFgAA/kmXmdG3wKqemMBbfBiGK52PbBMThDC4MPpZTc6IAAA=',
    },
    after: {
      src: '/images/before-after/case-1-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAABQAQCdASoQAAkABABoJQBOgCgAAP657f1usJXUzZFx2OOxpPibsDAA',
    },
  },
  {
    slug: 'case-2',
    before: {
      src: '/images/before-after/case-2-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoQAAkABABoJQBOgCHF39AA/j60eqYAAtmx+QpEi6ErSaRIAAA=',
    },
    after: {
      src: '/images/before-after/case-2-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoQAAkABABoJQBOgB5qmDAA/sAwQ4OXiDq7f63kuHdX7kgAAAA=',
    },
  },
  {
    slug: 'case-3',
    before: {
      src: '/images/before-after/case-3-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABQAQCdASoQAAkABABoJQBOgCgAAP7nGMIdf+o3S4l/2FuGS79rXimMAAA=',
    },
    after: {
      src: '/images/before-after/case-3-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAkABABoJQBOgBi3CGIAAP6Akjey25lT8xYsTYPp+yHJ8AA=',
    },
  },
  {
    slug: 'case-4',
    before: {
      src: '/images/before-after/case-4-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoQAAkABABoJQBOgBjEuWAA/ql/rxx9xFSkjEMuxK2dkOEgAAA=',
    },
    after: {
      src: '/images/before-after/case-4-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAkABABoJZACdADFz6wwAAD7km2FSTsImIdquPfIaL1TKvWicoAA',
    },
  },
  {
    slug: 'case-5',
    before: {
      src: '/images/before-after/case-5-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoQAAkABABoJZACdADwB3akAP06ISo64rVxDddIVR0alAi8NwZbdqUAAAA=',
    },
    after: {
      src: '/images/before-after/case-5-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADwAQCdASoQAAkABABoJZACdADwG18ZzgAA/j+VBSuL8ypL70O1sXVgLtGVetE5QAA=',
    },
  },
  {
    slug: 'case-6',
    before: {
      src: '/images/before-after/case-6-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoQAAkABABoJZgCdABV8gAA/rrnjTCRFUmE2wdr/xHEYooFK0V00wAA',
    },
    after: {
      src: '/images/before-after/case-6-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAQCdASoQAAkABABoJYgCdACpSHW4AP01INYecr7RpuPxGkYaNYMttggAAA==',
    },
  },
  {
    slug: 'case-7',
    before: {
      src: '/images/before-after/case-7-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoQAAkABABoJZgCdAChJtXQAP4TeRm3zYlODqHfXEYaNd0n6n8oAAAA',
    },
    after: {
      src: '/images/before-after/case-7-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoQAAkABABoJZACdACf2QgAAP2YwoIBYVHvexVixnGVzpGGjWDLc7KAAAA=',
    },
  },
  {
    slug: 'case-8',
    before: {
      src: '/images/before-after/case-8-before.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoQAAkABABoJagCdACyx35scAD+HWl5RBLX7fLr78lFhhME64Ela2AGoAA=',
    },
    after: {
      src: '/images/before-after/case-8-after.webp',
      width: 1600,
      height: 900,
      blurDataURL:
        'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAQCdASoQAAkABABoJZACdACh0vAgANxtalbR2iuzvTF60XguBJWUErgAAA==',
    },
  },
];
