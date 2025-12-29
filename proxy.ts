import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/utils/supabase/middleware-client";
import createIntlMiddleware from 'next-intl/middleware';
import { routing, type Locale } from './i18n/routing';
import type { DashboardPage, UserRole } from '@/lib/types/rbac';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

// Route to page mapping for RBAC
const ROUTE_PAGE_MAP: Record<string, DashboardPage> = {
  '/dashboard': 'dashboard',
  '/dashboard/templates': 'templates',
  '/dashboard/email-sender': 'email-sender',
  '/dashboard/registrations': 'registrations',
  '/dashboard/contacts': 'contacts',
  '/dashboard/campaigns': 'campaigns',
  '/dashboard/admin/users': 'user-management',
};

// Get the page from route (handles nested routes)
function getPageFromRoute(pathname: string): DashboardPage | null {
  // Remove locale prefix
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

  // Exact match first
  if (ROUTE_PAGE_MAP[cleanPath]) {
    return ROUTE_PAGE_MAP[cleanPath];
  }

  // Handle nested routes
  const parts = cleanPath.split('/').filter(Boolean);
  while (parts.length > 0) {
    const testPath = '/' + parts.join('/');
    if (ROUTE_PAGE_MAP[testPath]) {
      return ROUTE_PAGE_MAP[testPath];
    }
    parts.pop();
  }

  return null;
}

// Get route for a page
function getRouteForPage(page: DashboardPage): string {
  const entry = Object.entries(ROUTE_PAGE_MAP).find(([, p]) => p === page);
  return entry ? entry[0] : '/dashboard';
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the request is for a locale-specific path
  const pathnameHasLocale = routing.locales.some(
    (locale: Locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Get the locale from the path or default
  const locale = pathnameHasLocale
    ? pathname.split('/')[1]
    : routing.defaultLocale;

  // Define public paths that don't need auth
  const isPublicPath = (path: string) => {
    const publicPaths = ['/login', '/signup', '/auth/callback', '/waiting-for-role', '/waiting-for-privileges'];
    return publicPaths.some(p =>
      path === p ||
      path === `/${locale}${p}` ||
      routing.locales.some((l: Locale) => path === `/${l}${p}`)
    );
  };

  const isAuthPath = isPublicPath(pathname);

  // Run intl middleware first to handle locale routing
  const intlResponse = intlMiddleware(request);

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Configuration Error</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">⚠️ Configuration Error</h1>
          <p>Missing required environment variables:</p>
          <ul>
            <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
            <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
          </ul>
          <p>Please configure these in your <strong>Vercel Project Settings → Environment Variables</strong>.</p>
        </body>
      </html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Create Supabase client
  const { supabase, response } = await createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth protection logic
  if (!isAuthPath) {
    // Not logged in -> redirect to login
    if (!user) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Fetch app_user from database to check role
    const { data: appUser, error: appUserError } = await supabase
      .from('app_users')
      .select('id, role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    // Handle case where app_user doesn't exist yet (trigger might not have fired)
    if (appUserError || !appUser) {
      // User exists in auth but not in app_users yet - redirect to waiting
      const waitingUrl = new URL(`/${locale}/waiting-for-role`, request.url);
      return NextResponse.redirect(waitingUrl);
    }

    // User is deactivated
    if (!appUser.is_active) {
      await supabase.auth.signOut();
      const loginUrl = new URL(`/${locale}/login?message=Your account has been deactivated`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // User has no role assigned
    if (!appUser.role) {
      const waitingUrl = new URL(`/${locale}/waiting-for-role`, request.url);
      return NextResponse.redirect(waitingUrl);
    }

    // Get the page for current route
    const currentPage = getPageFromRoute(pathname);

    // If we can identify the page, check permissions
    if (currentPage) {
      // Fetch role permissions from database
      const { data: rolePermissions } = await supabase
        .from('role_permissions')
        .select('page')
        .eq('role', appUser.role as NonNullable<UserRole>);

      const allowedPages = (rolePermissions || []).map(rp => rp.page as DashboardPage);

      // Check if user has access to current page
      if (!allowedPages.includes(currentPage)) {
        // User doesn't have permission for this page
        if (allowedPages.length === 0) {
          // Has role but no permissions - redirect to waiting-for-privileges page
          const waitingUrl = new URL(`/${locale}/waiting-for-privileges`, request.url);
          return NextResponse.redirect(waitingUrl);
        }

        // Redirect to first allowed page
        const firstAllowedRoute = getRouteForPage(allowedPages[0]);
        const redirectUrl = new URL(`/${locale}${firstAllowedRoute}`, request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // If already logged in and trying to access auth pages
  if (isAuthPath && user) {
    // Check if user has a role
    const { data: appUser } = await supabase
      .from('app_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    const isWaitingRolePage = pathname.includes('/waiting-for-role');
    const isWaitingPrivilegesPage = pathname.includes('/waiting-for-privileges');

    if (appUser?.role && appUser?.is_active) {
      // Has role - check if has permissions
      const { data: rolePermissions } = await supabase
        .from('role_permissions')
        .select('page')
        .eq('role', appUser.role as NonNullable<UserRole>);

      const allowedPages = (rolePermissions || []).map(rp => rp.page as DashboardPage);

      if (allowedPages.length > 0) {
        // Has permissions -> redirect to first allowed page
        const firstAllowedRoute = getRouteForPage(allowedPages[0]);
        const redirectUrl = new URL(`/${locale}${firstAllowedRoute}`, request.url);
        return NextResponse.redirect(redirectUrl);
      } else if (!isWaitingPrivilegesPage) {
        // Has role but no permissions and not on waiting-for-privileges -> redirect
        const waitingUrl = new URL(`/${locale}/waiting-for-privileges`, request.url);
        return NextResponse.redirect(waitingUrl);
      }
      // If on waiting-for-privileges page and no permissions, stay there
    } else if (!isWaitingRolePage && (!appUser?.role || !appUser)) {
      // No role and not on waiting-for-role page -> redirect to waiting-for-role page
      const waitingUrl = new URL(`/${locale}/waiting-for-role`, request.url);
      return NextResponse.redirect(waitingUrl);
    }
    // If on waiting page and conditions met, stay there
  }

  // Merge cookies from both responses
  const finalResponse = intlResponse || response;

  // Copy Supabase cookies to the final response
  response.cookies.getAll().forEach((cookie: { name: string; value: string }) => {
    finalResponse.cookies.set(cookie.name, cookie.value);
  });

  return finalResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
