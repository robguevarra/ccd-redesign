/**
 * Before & After smile cases. Real patient photos supplied by the practice
 * (June 2026, "Website Updates" drop). Optimized to WebP and placed under
 * `public/images/before-after/` by `scripts/optimize-images.mjs` workflow.
 *
 * Display names are first name + last initial for patient privacy. Each pair is
 * rendered with the interactive <BeforeAfterSlider>.
 *
 * Note: most pairs are 4:3 landscape. The Susan H. "before" is portrait (3:4)
 * while her "after" is landscape, so the slider object-covers both into a
 * shared 4:3 box (center-cropped) to keep the wipe aligned.
 */

export interface BeforeAfterImage {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export interface BeforeAfterCase {
  slug: string;
  /** First name + last initial, for privacy. */
  patient: string;
  /** Optional short treatment label, e.g. "Porcelain veneers". */
  treatment?: string;
  before: BeforeAfterImage;
  after: BeforeAfterImage;
}

export const beforeAfterCases: BeforeAfterCase[] = [
  {
    slug: 'barbie-guinn',
    patient: 'Barbie G.',
    before: {
      src: '/images/before-after/barbie-guinn-before.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAABQBACdASoUAA8APu1iqU2ppaOiMAgBMB2JQBOmUABeN8XSeU+IZMRizE/QAPRDf/i3LpCZ+WODDaKJy1V3wE4+SZTCUcBOW53h3a3HiG4W4yWHj41pYufcw13QdklxGsfapOvAAAA=',
    },
    after: {
      src: '/images/before-after/barbie-guinn-after.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JYwCdMoABwZD8WIExAXZoAP4b78ZyFKECZLATHX9obvO/faq54XkMY7RmmnPc5UDywQkEPRP0bKEAAAA=',
    },
  },
  {
    slug: 'connie-wong',
    patient: 'Connie W.',
    before: {
      src: '/images/before-after/connie-wong-before.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAABQBACdASoUAA8APu1iqU2ppaOiMAgBMB2JYwCdMoADf2eBl/a3OdfZ7fQOAP7ckeaVtUGTcglNfnc5uRQGPqwNKsdAeukUlW5Q778cRaDvUsOs/VzC2AJw8MybIoQMs8bx4VH40QAAAA==',
    },
    after: {
      src: '/images/before-after/connie-wong-after.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAwCdASoUAA8APu1iqU2ppaQiMAgBMB2JQBOmUABYjH2vdOvICWtAAP59OJpLx7lJvH3ay4sVEzfTYMHCAwDYNesiZVrPFXdwef1B6sPlg/v9Ak7P8ZzUmlsPEP8jjAA=',
    },
  },
  {
    slug: 'dylan-escobar',
    patient: 'Dylan E.',
    before: {
      src: '/images/before-after/dylan-escobar-before.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAAAwBACdASoUAA8APu1iqU2ppaQiMAgBMB2JQBdgBFTApyCtJ2VILbFAAuAA881pgD+f1dS5Gse0F/LmdDEpyLhc+JwHno/f323fttlEwRbqY/fGulnsggF2cf8Lxb3l88Ad68Kob4d13WCPcXAGsCBJAAA=',
    },
    after: {
      src: '/images/before-after/dylan-escobar-after.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASoUAA8APu1iqU2ppaQiMAgBMB2JYgC7IExB9rO2o/Qa2AAA/U/Zclz1UdsHs+UmXl/pXyEmAB49RHD5K9skplA9arStL1QoqOLIOkOIZ6+K6vV4UQ0UEzyWXuxScrnIckQgIAwAAAA=',
    },
  },
  {
    slug: 'kelly-haus',
    patient: 'Kelly H.',
    before: {
      src: '/images/before-after/kelly-haus-before.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAwCdASoUAA8APu1iqk2ppaQiMAgBMB2JZACdAAM4PDVHlnwAAAD6LnAAR/dnGjBFPd2xPeSumeugwCylUW7PUXfyfrIIMtVCPdwxUx5kngrzOJYnVxcLa4AT9G9NbDfMHvquwAA=',
    },
    after: {
      src: '/images/before-after/kelly-haus-after.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAwCdASoUAA8APu1kqU2ppaQiMAgBMB2JYgCsLwABmc6QG1SdrMAA/W9pwVjxjiW3PCDqfPJp4jSpn3JaIc7lp6qomvOGt5R57WG5kBuHPduhtXEFZSnw4AA=',
    },
  },
  {
    slug: 'michelle-rubio',
    patient: 'Michelle R.',
    before: {
      src: '/images/before-after/michelle-rubio-before.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACwAwCdASoUAA8APu1iqU2ppaQiMAgBMB2JQBOgA2xbGKm5vkyRIAD+Gc/WVqUY8FVxQ5VPNvmR24rDU2eCd6AZ5WkLZ517t6TZ3J3J+l6rafEuVvOKcAevHpUvBhHW7KfnAH2oEg8UULNUAAA=',
    },
    after: {
      src: '/images/before-after/michelle-rubio-after.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAACwAwCdASoUAA8APu1iqU2ppaOiMAgBMB2JQBYdgeLCEUIzAkxxEADJ25771QjeYZQBhzVnNQVh3yqp0OZ9ogLXZ1pEIPBltsSqBRdTVTbCMonc8ic5uqNnNWGtWbqI7Y+0DVAA',
    },
  },
  {
    slug: 'susan-house',
    patient: 'Susan H.',
    before: {
      src: '/images/before-after/susan-house-before.webp',
      width: 1400,
      height: 1867,
      blurDataURL:
        'data:image/webp;base64,UklGRvIAAABXRUJQVlA4IOYAAACwBQCdASoUABsAPu1irFAppSQisBgIATAdiWoAsR9kOoAGhCQkg6uS6oXCPLm7rerj0855UIgA/gr12mWe/YX5zQ8NPQN9xUnpg8ZtWWXigaPyivPzRabIWEvzEi+fYl/poAhQdhmp0ASTa8TZVPPR4r1G8OSBh01Kzu+7GsFncryES8EJLPjglRzPcxEr7LfR2VhgoInQjjEnbN+sRMsEIb6x+G6OLQ/k/Fbq4e3D5cmNXGnyErQwkBx3vUFnnAoxsTHReVwwFMm1pY+6HfFXYdJE4v6dITs1K+pk7t4NUrSEkAAAAA==',
    },
    after: {
      src: '/images/before-after/susan-house-after.webp',
      width: 1400,
      height: 1050,
      blurDataURL:
        'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAQBACdASoUAA8APu1iqU2ppaOiMAgBMB2JYgCxGwABWVwIkiXhI3lfwAD+RgrBG6r3098o/uRYS+FpXuo8LJJmwDgN7XIlNUivGAaIQkl8T9kXiSgaIrduN2PhtJdJ48WXlD9oAAA=',
    },
  },
];
