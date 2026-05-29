-- 2026-05-29 — site_settings singleton + Weave Text Connect config.
--
-- Single-row table (id is always 1) holding site-wide toggles. First use:
-- the Weave Text Connect integration (floating "text us" widget + inline
-- buttons) with an admin on/off switch and a business-hours scheduler.
--
-- The `weave` config is intentionally non-sensitive (the Weave widget id is
-- already public in the embed <script> tag), so anon may read it — the
-- marketing site renders the widget from it. Only active owner/front_office
-- staff may write (front office answer the texts, so they control availability).
-- Idempotent.

create table if not exists public.site_settings (
  id integer primary key default 1,
  weave jsonb not null default jsonb_build_object(
    'enabled', false,
    'widgetId', '6d39d575-d6f2-45b7-8961-69a41b828fdb',
    'showFloatingWidget', true,
    'showInlineButtons', true,
    'schedule', jsonb_build_object('mode', 'always', 'blackoutDates', '[]'::jsonb),
    'offlineBehavior', 'hide',
    'timezone', 'America/Los_Angeles'
  ),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint site_settings_singleton check (id = 1)
);

-- Reuse the shared updated_at trigger fn created in the doctors migration.
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed the singleton row (no-op if it already exists).
insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Read: world-readable (config is non-sensitive; marketing site needs it).
drop policy if exists "site_settings_anon_read" on public.site_settings;
create policy "site_settings_anon_read" on public.site_settings
  for select to anon using (true);

drop policy if exists "site_settings_auth_read" on public.site_settings;
create policy "site_settings_auth_read" on public.site_settings
  for select to authenticated using (true);

-- Write: active owner OR front_office only (NOT editors). Server actions also
-- enforce this in app code; this is defense-in-depth.
create or replace function public.can_manage_settings()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.staff_users
    where user_id = auth.uid()
      and active = true
      and role in ('owner', 'front_office')
  );
$$;

revoke all on function public.can_manage_settings() from public;
grant execute on function public.can_manage_settings() to authenticated;

drop policy if exists "site_settings_manage_write" on public.site_settings;
create policy "site_settings_manage_write" on public.site_settings
  for update to authenticated
  using (public.can_manage_settings())
  with check (public.can_manage_settings());

comment on table public.site_settings is
  'Single-row (id=1) site-wide settings. Holds the Weave Text Connect config. World-readable; writes limited to active owner/front_office staff.';
