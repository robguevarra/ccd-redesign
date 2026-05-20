-- 2026-05-20 — Add 'front_office' to the staff_users role CHECK constraint.

alter table public.staff_users
  drop constraint if exists staff_users_role_check;

alter table public.staff_users
  add constraint staff_users_role_check
  check (role in ('owner', 'editor', 'front_office'));
