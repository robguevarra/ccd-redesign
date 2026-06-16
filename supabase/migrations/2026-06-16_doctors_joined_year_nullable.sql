-- Make doctors.joined_year optional.
--
-- "Year joined the practice" isn't always known for an associate. Rather than
-- inventing a year (which then renders as "With the practice since YYYY" on the
-- public profile), we store NULL and the profile hides that line.
--
-- Applied to the production project (qxicorwwknphfzvyjngz) on 2026-06-16.

alter table public.doctors
  alter column joined_year drop not null;

-- Dr. Serena Hsu's join year was not provided by the practice.
update public.doctors
  set joined_year = null
  where slug = 'dr-serena-hsu';
