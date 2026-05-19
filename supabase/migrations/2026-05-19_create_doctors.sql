-- 2026-05-19 — doctors table (CMS-managed)

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  title text not null,
  portrait_path text,
  portrait_alt text not null default '',
  portrait_object_position text not null default 'center center',
  short text not null,
  bio text not null,
  specialties text[] not null default '{}',
  joined_year int not null,
  is_lead boolean not null default false,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists doctors_one_lead
  on public.doctors (is_lead) where is_lead = true;

create index if not exists doctors_display_order
  on public.doctors (display_order, slug);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists doctors_set_updated_at on public.doctors;
create trigger doctors_set_updated_at before update on public.doctors
  for each row execute function public.set_updated_at();

alter table public.doctors enable row level security;

drop policy if exists "doctors_anon_read_active" on public.doctors;
create policy "doctors_anon_read_active" on public.doctors
  for select to anon using (active = true);

drop policy if exists "doctors_auth_read_all" on public.doctors;
create policy "doctors_auth_read_all" on public.doctors
  for select to authenticated using (true);

drop policy if exists "doctors_auth_write" on public.doctors;
create policy "doctors_auth_write" on public.doctors
  for all to authenticated using (true) with check (true);
