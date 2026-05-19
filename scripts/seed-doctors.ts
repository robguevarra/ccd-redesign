import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { doctors as seedDoctors } from '../content/doctors';

/**
 * One-shot: insert the 5 seed doctors into Supabase if the table is empty.
 * Idempotent — re-running after the table is populated is a no-op.
 *
 * Run AFTER the doctors table migration but BEFORE the blog_posts → doctors
 * FK migration (see plan stage 6).
 *
 * Usage:
 *   pnpm tsx scripts/seed-doctors.ts
 */
async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count, error: countErr } = await supabase
    .from('doctors').select('*', { count: 'exact', head: true });
  if (countErr) throw countErr;
  if ((count ?? 0) > 0) {
    console.log(`doctors table not empty (${count} rows). Skipping seed.`);
    return;
  }

  const rows = seedDoctors.map((d, i) => ({
    slug: d.slug,
    name: d.name,
    title: d.title,
    portrait_path: null,
    portrait_alt: d.portrait.alt,
    portrait_object_position: d.portrait.objectPosition ?? 'center center',
    short: d.short,
    bio: d.bio,
    specialties: d.specialties,
    joined_year: d.joinedYear,
    is_lead: d.isLead,
    display_order: i,
    active: true,
  }));

  const { error } = await supabase.from('doctors').insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} doctors.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
