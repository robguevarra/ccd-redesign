-- 2026-05-19 — is_active_owner() function + staff_users owner-read-all RLS policy
-- This is the SQL that was applied via MCP after the initial staff_users migration.
-- Checking it in so a fresh environment setup will run it. Idempotent.

create or replace function public.is_active_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.staff_users
    where user_id = auth.uid() and role = 'owner' and active
  );
$$;

revoke all on function public.is_active_owner() from public;
grant execute on function public.is_active_owner() to authenticated;

drop policy if exists "staff_users_owner_read_all" on public.staff_users;
create policy "staff_users_owner_read_all" on public.staff_users
  for select to authenticated
  using (public.is_active_owner());
