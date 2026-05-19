-- 2026-05-19 — patient_forms table (admin-managed PDF library)

create table if not exists public.patient_forms (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  file_path text not null,
  file_size_bytes int,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patient_forms_display_order
  on public.patient_forms (display_order, id);

drop trigger if exists patient_forms_set_updated_at on public.patient_forms;
create trigger patient_forms_set_updated_at before update on public.patient_forms
  for each row execute function public.set_updated_at();

alter table public.patient_forms enable row level security;

drop policy if exists "patient_forms_anon_read_active" on public.patient_forms;
create policy "patient_forms_anon_read_active" on public.patient_forms
  for select to anon using (active = true);

drop policy if exists "patient_forms_auth_read_all" on public.patient_forms;
create policy "patient_forms_auth_read_all" on public.patient_forms
  for select to authenticated using (true);

drop policy if exists "patient_forms_auth_write" on public.patient_forms;
create policy "patient_forms_auth_write" on public.patient_forms
  for all to authenticated using (true) with check (true);
