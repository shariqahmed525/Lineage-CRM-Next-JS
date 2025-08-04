import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createClient } from '@/utils/supabase/server';

/**
 * Middleware to ensure user authentication across specific routes.
 *
 * This middleware function checks if a user is authenticated by querying the user details
 * from Supabase Auth. If the user is not authenticated, they are redirected to the login page.
 * Authenticated users are allowed to proceed with their request.
 *
 * The middleware is applied only to specific routes that do not match the patterns listed in the `config.matcher`.
 * These patterns exclude static files, images, the login page itself, and other media files from authentication checks,
 * optimizing performance and user experience by not requiring auth checks on public resources.
 */
/**
 * To add another page to be PUBLICLY accessible (i.e., avoid the login redirect):
 * 1. Create the new page in the `(pages)/(public)` directory.
 * 2. Add the new page's route to the `matcher` array in the `config` object above.
 *    For example, if the new page is `(pages)/(public)/contact`, add `contact` to the `matcher` array:
 *    '/((?!_next/static|_next/image|favicon.ico|login|terms|privacy|about|contact).*)'
 * 3. Save the changes and redeploy your application.
 */

export async function middleware(req: NextRequest) {
  // Initialize the Supabase client
  const supabase = createClient();

  // Attempt to retrieve the current user from Supabase Auth
  const response = await supabase.auth.getUser();
  const { user } = response.data;

  // Check if a user is authenticated
  if (!user) {
    // User is not authenticated, redirect them to the login page
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // User is authenticated, proceed with the request
  return NextResponse.next();
}

// Configuration for the middleware specifying which routes it should apply to
export const config = {
  matcher: [
    // Regex pattern to exclude specific paths and file types from the middleware
    // This includes static files, images, the login page, and public pages
    '/((?!_next/static|_next/image|favicon.ico|login|terms|privacy|about|contact|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
