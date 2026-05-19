import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * One-shot: bootstrap the first staff_users row as 'owner' if the table
 * is empty. Reads SEED_OWNER_EMAIL from env. Looks up the auth.users row
 * by email; if no auth user exists yet, sends a magic-link invite first.
 *
 * Run BEFORE Stage 2 (multi-user auth) lands, so the owner can log in.
 *
 * Usage:
 *   pnpm tsx scripts/seed-owner.ts
 */
async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.SEED_OWNER_EMAIL;
  if (!url || !key || !email) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_OWNER_EMAIL all required.',
    );
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count } = await supabase
    .from('staff_users').select('*', { count: 'exact', head: true });
  if ((count ?? 0) > 0) {
    console.log(`staff_users not empty (${count} rows). Skipping seed.`);
    return;
  }

  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) throw listErr;
  let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const { data: invited, error: invErr } =
      await supabase.auth.admin.inviteUserByEmail(email, {
        data: { display_name: 'Owner', role: 'owner' },
      });
    if (invErr) throw invErr;
    user = invited.user;
    console.log(`Sent invite to ${email}; auth.users row created.`);
  }

  if (!user) throw new Error('Failed to resolve auth user.');

  const { error: insErr } = await supabase.from('staff_users').insert({
    user_id: user.id,
    email,
    display_name: 'Owner',
    role: 'owner',
    active: true,
  });
  if (insErr) throw insErr;

  console.log(`Seeded owner: ${email} (auth.users.id=${user.id}).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
