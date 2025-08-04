import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

/**
 * Handles the OAuth callback for Supabase authentication.
 *
 * This route is set as the callback URL in the Supabase Auth UI. When a user completes the authentication
 * process with an external provider (like Google, GitHub, etc.), they are redirected back to this URL.
 * The URL includes a 'code' parameter that can be exchanged for a user session.
 *
 * The function checks for the presence of this 'code'. If absent, it responds with an error.
 * If present, it attempts to exchange the code for a session using Supabase's `getSessionFromUrl` method.
 *
 * If the session is successfully retrieved, the function sets HTTP-only cookies for the access and refresh tokens
 * and redirects the user to the '/leads' page. If any error occurs during the session retrieval or if the session
 * is not created, the user is redirected back to the login page.
 */
export async function GET(request: NextRequest) {
  console.log('Received a request:', request.url);
  const supabase = createClient();
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  console.log('Received a code:', code);

  // Check if the 'code' parameter is present in the URL
  if (!code) {
    // Respond with an error if 'code' is missing
    return new NextResponse(JSON.stringify({ error: 'Code is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Attempt to exchange the 'code' for a session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (session) {
      console.log(
        'Session:', session, session.access_token, session.provider_refresh_token, session.provider_token
      );
      // If a session is obtained, set session cookies and redirect to '/leads'
      const cookieOptions = { path: '/', httpOnly: true, sameSite: 'Lax' };
      const res = new NextResponse(null, {
        headers: {
          'Set-Cookie': [
            `sb:access_token=${session.access_token}; Path=/; HttpOnly; SameSite=Lax`,
            `sb:refresh_token=${session.refresh_token}; Path=/; HttpOnly; SameSite=Lax`,
          ],
        },
      });
      res.headers.append('Location', `${process.env.NEXT_PUBLIC_BASE_URL}/leads`);
      res.status = 307;
      return res;
    }
    // Redirect to login if no session is created
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  } catch (error) {
    // Handle errors during the session exchange
    console.error('Failed to exchange code for session:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to exchange code' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
