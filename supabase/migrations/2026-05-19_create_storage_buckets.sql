-- 2026-05-19 — storage buckets for admin uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('doctor-portraits', 'doctor-portraits', true, 5 * 1024 * 1024,
   array['image/jpeg', 'image/png', 'image/webp']),
  ('patient-forms', 'patient-forms', true, 10 * 1024 * 1024,
   array['application/pdf']),
  ('blog-images', 'blog-images', true, 8 * 1024 * 1024,
   array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Public read doctor-portraits" on storage.objects;
create policy "Public read doctor-portraits" on storage.objects
  for select using (bucket_id = 'doctor-portraits');

drop policy if exists "Public read patient-forms" on storage.objects;
create policy "Public read patient-forms" on storage.objects
  for select using (bucket_id = 'patient-forms');

drop policy if exists "Public read blog-images" on storage.objects;
create policy "Public read blog-images" on storage.objects
  for select using (bucket_id = 'blog-images');

drop policy if exists "Authenticated write doctor-portraits" on storage.objects;
create policy "Authenticated write doctor-portraits" on storage.objects
  for insert to authenticated with check (bucket_id = 'doctor-portraits');

drop policy if exists "Authenticated update doctor-portraits" on storage.objects;
create policy "Authenticated update doctor-portraits" on storage.objects
  for update to authenticated using (bucket_id = 'doctor-portraits');

drop policy if exists "Authenticated delete doctor-portraits" on storage.objects;
create policy "Authenticated delete doctor-portraits" on storage.objects
  for delete to authenticated using (bucket_id = 'doctor-portraits');

drop policy if exists "Authenticated write patient-forms" on storage.objects;
create policy "Authenticated write patient-forms" on storage.objects
  for insert to authenticated with check (bucket_id = 'patient-forms');

drop policy if exists "Authenticated update patient-forms" on storage.objects;
create policy "Authenticated update patient-forms" on storage.objects
  for update to authenticated using (bucket_id = 'patient-forms');

drop policy if exists "Authenticated delete patient-forms" on storage.objects;
create policy "Authenticated delete patient-forms" on storage.objects
  for delete to authenticated using (bucket_id = 'patient-forms');

drop policy if exists "Authenticated write blog-images" on storage.objects;
create policy "Authenticated write blog-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated update blog-images" on storage.objects;
create policy "Authenticated update blog-images" on storage.objects
  for update to authenticated using (bucket_id = 'blog-images');

drop policy if exists "Authenticated delete blog-images" on storage.objects;
create policy "Authenticated delete blog-images" on storage.objects
  for delete to authenticated using (bucket_id = 'blog-images');
