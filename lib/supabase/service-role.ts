import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client that bypasses RLS. Use ONLY for operations that
 * must run with elevated privileges — currently:
 *   - inviteUserByEmail in the staff_users invite flow
 *   - writing to staff_users (since RLS only allows users to read their own row)
 *
 * NEVER import this from a client component. The 'server-only' import
 * forces a build error if any client bundle pulls this file in.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY missing — required for admin operations.',
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
