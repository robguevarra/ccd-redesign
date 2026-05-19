-- 2026-05-19 — blog_posts.author_doctor_slug FK → doctors.slug
-- Run AFTER doctors are seeded.

alter table public.blog_posts
  add constraint blog_posts_author_doctor_slug_fkey
  foreign key (author_doctor_slug) references public.doctors(slug)
  on delete set null on update cascade;
