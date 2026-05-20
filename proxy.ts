import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Refresh the Supabase auth session on every request and gate /admin/* routes
 * behind authentication AND active staff_users membership.
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate /admin/* (except /admin/login + /admin/access-denied) behind both
  // authentication AND active staff_users membership.
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isExempt =
    request.nextUrl.pathname.startsWith('/admin/login') ||
    request.nextUrl.pathname.startsWith('/admin/access-denied') ||
    request.nextUrl.pathname.startsWith('/admin/forgot-password') ||
    request.nextUrl.pathname.startsWith('/admin/auth/callback');

  if (isAdminPath && !isExempt) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    const { data: staff } = await supabase
      .from('staff_users')
      .select('role, active')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!staff || !staff.active) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/access-denied';
      return NextResponse.redirect(url);
    }
    // Owner-only path guard for /admin/users/*.
    if (
      request.nextUrl.pathname.startsWith('/admin/users') &&
      staff.role !== 'owner'
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }

    // Front office: locked to /admin/inquiries* (and /admin/dashboard which
    // redirects them to /admin/inquiries via the page itself).
    if (staff.role === 'front_office') {
      const allowed =
        request.nextUrl.pathname === '/admin/dashboard' ||
        request.nextUrl.pathname.startsWith('/admin/inquiries');
      if (!allowed) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/inquiries';
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect authenticated users away from /admin/login to dashboard.
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

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
