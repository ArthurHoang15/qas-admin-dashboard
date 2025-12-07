import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/utils/supabase/middleware";
import createIntlMiddleware from 'next-intl/middleware';
import { routing, type Locale } from './i18n/routing';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the request is for a locale-specific path
  const pathnameHasLocale = routing.locales.some(
    (locale: Locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Get the locale from the path or default
  const locale = pathnameHasLocale
    ? pathname.split('/')[1]
    : routing.defaultLocale;

  // Define paths that don't need auth (login pages for all locales)
  const isLoginPath = pathname === '/login' ||
    pathname === `/${locale}/login` ||
    routing.locales.some((l: Locale) => pathname === `/${l}/login`);

  // Run intl middleware first to handle locale routing
  const intlResponse = intlMiddleware(request);

  // Create Supabase client
  const { supabase, response } = await createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth protection logic
  if (!isLoginPath) {
    // Not logged in -> redirect to login
    if (!user) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not admin -> sign out and redirect
    if (user.email !== process.env.ADMIN_EMAIL) {
      await supabase.auth.signOut();
      const loginUrl = new URL(`/${locale}/login?message=Unauthorized Access`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and trying to access login page -> redirect to dashboard
  if (isLoginPath && user) {
    if (user.email === process.env.ADMIN_EMAIL) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
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
