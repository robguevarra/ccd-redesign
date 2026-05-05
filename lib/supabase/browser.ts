import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase browser client. Use in Client Components only.
 * Server Components and Server Actions should use the server client
 * from `lib/supabase/server.ts` so cookies are handled correctly.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
