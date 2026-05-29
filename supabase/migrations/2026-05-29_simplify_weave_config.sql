-- 2026-05-29 — Simplify the Weave config shape.
--
-- The site-wide floating widget, per-surface toggles, and off-hours "show
-- call" behavior were removed at the practice's request. There is now a single
-- "Text us" button (opens a modal embedding Weave's hosted page). Trim the
-- column default and the existing row to the smaller shape. Idempotent.
--
-- New shape: { enabled, widgetId, schedule:{mode, blackoutDates}, timezone }

alter table public.site_settings
  alter column weave set default jsonb_build_object(
    'enabled', false,
    'widgetId', '6d39d575-d6f2-45b7-8961-69a41b828fdb',
    'schedule', jsonb_build_object('mode', 'always', 'blackoutDates', '[]'::jsonb),
    'timezone', 'America/Los_Angeles'
  );

-- Drop the now-unused keys from the existing singleton row (keeps the DB tidy;
-- the app's normalizeWeaveConfig would ignore them anyway).
update public.site_settings
set weave = (weave - 'showFloatingWidget' - 'showInlineButtons' - 'offlineBehavior')
where id = 1;
