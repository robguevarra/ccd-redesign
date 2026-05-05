import type { Review } from './schemas';

/**
 * Curated 5★ reviews. Sourced from the practice's existing Yelp + Google
 * presence (text discoverable in `source/pages/index.md` and the testimonial
 * group pages). Trimmed for length where needed; substantive content unchanged.
 *
 * v2 connects this to the Google Places API on a nightly cron — see master
 * spec [§ rendering strategy].
 */
export const reviews: Review[] = [
  {
    id: 'rev-michael-s',
    source: 'yelp',
    authorName: 'Michael S.',
    authorInitial: 'M.S.',
    rating: 5,
    body: "Dr. Brien Hsu has been my dentist for many years. I am by no means a fan of going to the dentist, but I can honestly say my experiences with Dr. Hsu have always been pleasant. I recently moved from California to Texas and a 15-year-old root canal started giving me trouble. A Texas dentist sent me to two implant specialists who recommended an expensive extraction and implant. I asked Dr. Hsu for a 2nd opinion. After he reviewed my x-rays, he told me he could probably save the tooth. I flew back to Rancho Cucamonga, had what I'd call the most painless root canal procedure I've ever had, and saved my tooth — plus a lot of money. Dr. Hsu has always been very honest with me and his dental work has always been painless.",
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: true,
    order: 1,
  },
  {
    id: 'rev-cat-h',
    source: 'yelp',
    authorName: 'Cat H.',
    authorInitial: 'C.H.',
    rating: 5,
    body: "I travel to this dentist for one reason. I believe Dr. Hsu is the best dentist period. He has very gentle hands and pays a lot of attention to making sure we're always comfortable. I don't know how he does it, but his shots never hurt — he doesn't even use that numbing cream before giving me an injection, and I still never feel it. I've even seen him work on my children — they think he is some kind of magician. When we visit Dr. Hsu and his staff, we always feel warm and welcome.",
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: true,
    order: 2,
  },
  {
    id: 'rev-jen-c',
    source: 'yelp',
    authorName: 'Jen C.',
    authorInitial: 'J.C.',
    rating: 5,
    body: "I've been a patient of Dr. Hsu for years and can honestly say he is the most pain-free, efficient and knowledgeable dentist I've ever had. Before Comfort Care I'd seen a multitude of dentists and none of the experiences could be called pleasant — I'd usually walk away with an aching jaw and nightmares of needles. I'd built up an intense fear of going to the dentist. When Dr. Hsu numbed my mouth, I didn't even feel the needle going in. From there, all the drilling and filling was completely painless. His work is solid (never had a filling fall out), and he takes the time to update me as he's working.",
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: true,
    order: 3,
  },
  {
    id: 'rev-melissa-b',
    source: 'yelp',
    authorName: 'Melissa B.',
    authorInitial: 'M.B.',
    rating: 5,
    body: "I came here to get a crown done. I delayed getting my teeth fixed due to fear of pain. To my surprise it was a smooth and comfortable process. The office was beautiful like a spa. Dr. Hsu was very communicative for each step. I didn't feel a thing! I also brought my toddler — it was her first experience and I was more nervous for her than for myself, but she did great and even had a sealant done. She had no fear or discomfort. Dr. Hsu and his staff are great with kids too!",
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: true,
    order: 4,
  },
  {
    id: 'rev-honest-veneers',
    source: 'yelp',
    authorName: 'A patient',
    authorInitial: 'Anonymous',
    rating: 5,
    body: 'I asked Dr. Hsu about getting veneers for my front teeth after watching how they were done on a TV show. He could have just done them. Instead he was very thorough explaining the process — both benefits and consequences. He convinced me NOT to do the veneers because he didn\'t feel comfortable shaving down healthy teeth. Instead he offered me an alternative: deep bleaching. He was able to make my teeth beautifully white without cutting my teeth down — and saved me thousands of dollars. If there was a way to rate this dentist above 5 stars, I would.',
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: true,
    order: 5,
  },
  {
    id: 'rev-second-opinion',
    source: 'yelp',
    authorName: 'A first-time patient',
    authorInitial: 'Anonymous',
    rating: 5,
    body: 'Just moved into the area and was looking for a good dentist. My insurance sent me to some guy who, when I stepped out of his office, gave me a laundry list of dental work. I didn\'t trust him, so I talked to my neighbor — she recommended Dr. Hsu. The office looks like a five-star hotel and the staff were nice and helpful. Dr. Hsu was very thorough in his explanations and seemed to genuinely care more about my teeth than killing my checkbook. I ended up just needing a few fillings — quite the contrast from the list of dental crap from the other office.',
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: false,
    order: 6,
  },
  {
    id: 'rev-special-needs',
    source: 'yelp',
    authorName: 'A parent',
    authorInitial: 'Anonymous',
    rating: 5,
    body: "I have been a patient for many years and I wanted to let everyone know he is the best dentist I have ever seen. He is very honest, professional, and caring. My son is special needs and Dr. Hsu and his office is very patient and caring with him. After seeing Dr. Hsu I will not go to any other dentist ever again. I have had horrible experiences with other offices — being very unprofessional and trying to charge me and my insurance for things not needed. If you want to have a good experience I suggest you go to this office.",
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: false,
    order: 7,
  },
  {
    id: 'rev-aesthetics',
    source: 'yelp',
    authorName: 'A long-term patient',
    authorInitial: 'Anonymous',
    rating: 5,
    body: 'This doctor knows what he is doing. Professional, knowledgeable, and very friendly. Dr. Hsu is the first dentist I have visited who makes the process completely painless. Not only does he have good technique, he pays a lot of attention to aesthetics. Yes — I want a dentist who not only makes my teeth healthy but gives me a pretty smile!',
    sourceUrl: 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga',
    featured: false,
    order: 8,
  },
];

export const featuredReviews = reviews.filter((r) => r.featured);
