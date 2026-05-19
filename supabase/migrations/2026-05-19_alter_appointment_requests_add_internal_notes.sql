-- 2026-05-19 — appointment_requests: add internal_notes

alter table public.appointment_requests
  add column if not exists internal_notes text;
