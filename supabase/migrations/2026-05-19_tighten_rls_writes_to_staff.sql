-- 2026-05-19 — Defense-in-depth: restrict mutations on admin-managed tables
-- and storage buckets to authenticated users who are active in staff_users.
-- Middleware is the primary gate; this is the second line of defense.

create or replace function public.is_active_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.staff_users
    where user_id = auth.uid() and active = true
  );
$$;

revoke all on function public.is_active_staff() from public;
grant execute on function public.is_active_staff() to authenticated;

drop policy if exists "doctors_auth_write" on public.doctors;
create policy "doctors_auth_write" on public.doctors
  for all to authenticated
  using (public.is_active_staff())
  with check (public.is_active_staff());

drop policy if exists "patient_forms_auth_write" on public.patient_forms;
create policy "patient_forms_auth_write" on public.patient_forms
  for all to authenticated
  using (public.is_active_staff())
  with check (public.is_active_staff());

drop policy if exists "blog_posts_auth_write" on public.blog_posts;
create policy "blog_posts_auth_write" on public.blog_posts
  for all to authenticated
  using (public.is_active_staff())
  with check (public.is_active_staff());

drop policy if exists "Authenticated write doctor-portraits" on storage.objects;
create policy "Authenticated write doctor-portraits" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'doctor-portraits' and public.is_active_staff());

drop policy if exists "Authenticated update doctor-portraits" on storage.objects;
create policy "Authenticated update doctor-portraits" on storage.objects
  for update to authenticated
  using (bucket_id = 'doctor-portraits' and public.is_active_staff());

drop policy if exists "Authenticated delete doctor-portraits" on storage.objects;
create policy "Authenticated delete doctor-portraits" on storage.objects
  for delete to authenticated
  using (bucket_id = 'doctor-portraits' and public.is_active_staff());

drop policy if exists "Authenticated write patient-forms" on storage.objects;
create policy "Authenticated write patient-forms" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'patient-forms' and public.is_active_staff());

drop policy if exists "Authenticated update patient-forms" on storage.objects;
create policy "Authenticated update patient-forms" on storage.objects
  for update to authenticated
  using (bucket_id = 'patient-forms' and public.is_active_staff());

drop policy if exists "Authenticated delete patient-forms" on storage.objects;
create policy "Authenticated delete patient-forms" on storage.objects
  for delete to authenticated
  using (bucket_id = 'patient-forms' and public.is_active_staff());

drop policy if exists "Authenticated write blog-images" on storage.objects;
create policy "Authenticated write blog-images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-images' and public.is_active_staff());

drop policy if exists "Authenticated update blog-images" on storage.objects;
create policy "Authenticated update blog-images" on storage.objects
  for update to authenticated
  using (bucket_id = 'blog-images' and public.is_active_staff());

drop policy if exists "Authenticated delete blog-images" on storage.objects;
create policy "Authenticated delete blog-images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_active_staff());
