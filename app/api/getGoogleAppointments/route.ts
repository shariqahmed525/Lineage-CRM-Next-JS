import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { data: { session_data } } = await supabase
    .from('profile')
    .select('session_data')
    .eq('user_id', user.user.id)
    .single();

  const { provider_token, provider_refresh_token } = session_data;

  // Use environment variables for client ID and secret
  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({
    access_token: provider_token,
    refresh_token: provider_refresh_token,
    scope: 'https://www.googleapis.com/auth/calendar',
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const lastDayOfMonth = new Date(firstDayOfMonth);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  try {
    const { data: { items: events } } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: firstDayOfMonth.toISOString(),
      timeMax: lastDayOfMonth.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return new NextResponse(JSON.stringify(events), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch events', details: err }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
