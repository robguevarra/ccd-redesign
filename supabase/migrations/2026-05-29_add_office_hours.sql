-- 2026-05-29 — Make office hours admin-editable.
--
-- Adds a `hours` jsonb column to the site_settings singleton, seeded from the
-- values that were previously hard-coded in content/practice-info.ts. Once
-- editable here, the footer, contact page, schema.org structured data, and the
-- Weave "business hours" scheduler all read this single source of truth.
--
-- Shape: array of { day, open, close, closed? } — mirrors BusinessHours in
-- content/schemas.ts. Same RLS as the table (world-readable; owner/front_office
-- write). Idempotent.

alter table public.site_settings
  add column if not exists hours jsonb not null default '[
    {"day": "Monday",    "open": "09:00", "close": "18:00"},
    {"day": "Tuesday",   "open": "09:00", "close": "18:00"},
    {"day": "Wednesday", "open": "08:00", "close": "17:00"},
    {"day": "Thursday",  "open": "09:00", "close": "18:00"},
    {"day": "Friday",    "open": "",      "close": "",      "closed": true},
    {"day": "Saturday",  "open": "",      "close": "",      "closed": true},
    {"day": "Sunday",    "open": "",      "close": "",      "closed": true}
  ]'::jsonb;
