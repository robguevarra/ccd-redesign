-- Patient reviews, moved from the static content/reviews.ts file into a table
-- so staff can add / edit / reorder them from /admin/reviews.
--
-- Mirrors the doctors table: anon reads only `active = true` rows, authenticated
-- staff read all rows, and writes are limited to active staff via the shared
-- public.is_active_staff() helper. Reuses the global public.set_updated_at()
-- trigger function.
--
-- Applied to the production project (qxicorwwknphfzvyjngz).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'yelp' check (source in ('google', 'yelp', 'facebook')),
  author_name text not null,
  author_initial text,
  rating int not null default 5 check (rating between 1 and 5),
  body text not null,
  source_url text not null default '',
  featured boolean not null default false,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_display_order on public.reviews (display_order, created_at);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

-- anon: read only active rows
create policy "reviews_anon_read_active" on public.reviews
  for select to anon using (active = true);

-- authenticated staff: read ALL rows (so admin sees hidden ones)
create policy "reviews_auth_read_all" on public.reviews
  for select to authenticated using (true);

-- authenticated write — active staff only
create policy "reviews_auth_write" on public.reviews
  for all to authenticated
  using (public.is_active_staff())
  with check (public.is_active_staff());

-- Seed with the existing curated reviews (previously content/reviews.ts).
insert into public.reviews
  (source, author_name, author_initial, rating, body, source_url, featured, display_order)
values
  ('yelp', 'Michael S.', 'M.S.', 5, 'Dr. Brien Hsu has been my dentist for many years. I am by no means a fan of going to the dentist, but I can honestly say my experiences with Dr. Hsu have always been pleasant. I recently moved from California to Texas and a 15-year-old root canal started giving me trouble. A Texas dentist sent me to two implant specialists who recommended an expensive extraction and implant. I asked Dr. Hsu for a 2nd opinion. After he reviewed my x-rays, he told me he could probably save the tooth. I flew back to Rancho Cucamonga, had what I''d call the most painless root canal procedure I''ve ever had, and saved my tooth — plus a lot of money. Dr. Hsu has always been very honest with me and his dental work has always been painless.', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', true, 1),
  ('yelp', 'Cat H.', 'C.H.', 5, 'I travel to this dentist for one reason. I believe Dr. Hsu is the best dentist period. He has very gentle hands and pays a lot of attention to making sure we''re always comfortable. I don''t know how he does it, but his shots never hurt — he doesn''t even use that numbing cream before giving me an injection, and I still never feel it. I''ve even seen him work on my children — they think he is some kind of magician. When we visit Dr. Hsu and his staff, we always feel warm and welcome.', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', true, 2),
  ('yelp', 'Jen C.', 'J.C.', 5, 'I''ve been a patient of Dr. Hsu for years and can honestly say he is the most pain-free, efficient and knowledgeable dentist I''ve ever had. Before Comfort Care I''d seen a multitude of dentists and none of the experiences could be called pleasant — I''d usually walk away with an aching jaw and nightmares of needles. I''d built up an intense fear of going to the dentist. When Dr. Hsu numbed my mouth, I didn''t even feel the needle going in. From there, all the drilling and filling was completely painless. His work is solid (never had a filling fall out), and he takes the time to update me as he''s working.', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', true, 3),
  ('yelp', 'Melissa B.', 'M.B.', 5, 'I came here to get a crown done. I delayed getting my teeth fixed due to fear of pain. To my surprise it was a smooth and comfortable process. The office was beautiful like a spa. Dr. Hsu was very communicative for each step. I didn''t feel a thing! I also brought my toddler — it was her first experience and I was more nervous for her than for myself, but she did great and even had a sealant done. She had no fear or discomfort. Dr. Hsu and his staff are great with kids too!', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', true, 4),
  ('yelp', 'A patient', 'Anonymous', 5, 'I asked Dr. Hsu about getting veneers for my front teeth after watching how they were done on a TV show. He could have just done them. Instead he was very thorough explaining the process — both benefits and consequences. He convinced me NOT to do the veneers because he didn''t feel comfortable shaving down healthy teeth. Instead he offered me an alternative: deep bleaching. He was able to make my teeth beautifully white without cutting my teeth down — and saved me thousands of dollars. If there was a way to rate this dentist above 5 stars, I would.', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', true, 5),
  ('yelp', 'A first-time patient', 'Anonymous', 5, 'Just moved into the area and was looking for a good dentist. My insurance sent me to some guy who, when I stepped out of his office, gave me a laundry list of dental work. I didn''t trust him, so I talked to my neighbor — she recommended Dr. Hsu. The office looks like a five-star hotel and the staff were nice and helpful. Dr. Hsu was very thorough in his explanations and seemed to genuinely care more about my teeth than killing my checkbook. I ended up just needing a few fillings — quite the contrast from the list of dental crap from the other office.', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', false, 6),
  ('yelp', 'A parent', 'Anonymous', 5, 'I have been a patient for many years and I wanted to let everyone know he is the best dentist I have ever seen. He is very honest, professional, and caring. My son is special needs and Dr. Hsu and his office is very patient and caring with him. After seeing Dr. Hsu I will not go to any other dentist ever again. I have had horrible experiences with other offices — being very unprofessional and trying to charge me and my insurance for things not needed. If you want to have a good experience I suggest you go to this office.', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', false, 7),
  ('yelp', 'A long-term patient', 'Anonymous', 5, 'This doctor knows what he is doing. Professional, knowledgeable, and very friendly. Dr. Hsu is the first dentist I have visited who makes the process completely painless. Not only does he have good technique, he pays a lot of attention to aesthetics. Yes — I want a dentist who not only makes my teeth healthy but gives me a pretty smile!', 'https://www.yelp.com/biz/comfort-care-dental-practice-brien-hsu-dds-rancho-cucamonga', false, 8);
