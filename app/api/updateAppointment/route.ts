import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  const body = await request.json();
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

  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('google_event_id')
    .match({ appointment_id: body.appointment_id })
    .single();

  if (appointmentError) {
    console.error('Error fetching appointment:', appointmentError);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch appointment.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (!appointment?.google_event_id) {
    console.error('Appointment does not have a Google event ID.');
    return new NextResponse(JSON.stringify({ error: 'Appointment does not have a Google event ID.' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Update Google Calendar event
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: body.title,
    location: body.location,
    description: body.note,
    start: {
      dateTime: body.start_date,
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: body.end_date,
      timeZone: 'America/New_York',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };
  const res = await calendar.events.update({
    calendarId: 'primary',
    eventId: appointment.google_event_id,
    resource: event,
  });

  if (res.data?.error) {
    console.error('Error updating Google Calendar event:', res.data.error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update Google Calendar event.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(body)
    .match({ appointment_id: body.appointment_id });

  if (error) {
    console.error('Error updating appointment:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update appointment.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
