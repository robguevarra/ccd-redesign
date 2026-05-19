-- 2026-05-19 — staff_users allowlist (multi-user staff auth)

create table if not exists public.staff_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  role text not null check (role in ('owner', 'editor')),
  doctor_slug text references public.doctors(slug) on delete set null on update cascade,
  active boolean not null default true,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists staff_users_email on public.staff_users (email);
create index if not exists staff_users_role on public.staff_users (role);

alter table public.staff_users enable row level security;

drop policy if exists "staff_users_read_own" on public.staff_users;
create policy "staff_users_read_own" on public.staff_users
  for select to authenticated using (user_id = auth.uid());
