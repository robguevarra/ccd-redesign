import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Refresh the Supabase auth session on every request and gate /admin/* routes
 * behind authentication. Per Supabase SSR best practices.
 *
 * In Next 16+ the file/export convention is `proxy` (was `middleware`).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Critical: refresh the session token on every request.
  await supabase.auth.getUser();

  // TEMP (explore mode): /admin/* auth gate disabled so the dentist and
  // engagement owner can click through the admin UI without logging in
  // during CMS-expansion design review. Restore by reinstating the two
  // redirect blocks below before pitch day.
  //
  // if (
  //   request.nextUrl.pathname.startsWith('/admin') &&
  //   !request.nextUrl.pathname.startsWith('/admin/login') &&
  //   !user
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/admin/login';
  //   url.searchParams.set('next', request.nextUrl.pathname);
  //   return NextResponse.redirect(url);
  // }
  //
  // if (request.nextUrl.pathname === '/admin/login' && user) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/admin/dashboard';
  //   return NextResponse.redirect(url);
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon, sitemap.xml, robots.txt
     * - any file with an extension (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)',
  ],
};
