import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { data: profileData } = await supabase
    .from('profile')
    .select('session_data')
    .eq('user_id', userData?.user?.id)
    .single();

  const { provider_token, provider_refresh_token } = profileData?.session_data || {};

  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({
    access_token: provider_token,
    refresh_token: provider_refresh_token,
    scope: 'https://www.googleapis.com/auth/calendar',
  });

  const body = await request.json();
  console.log('da body', body);

  const { data: appointmentData, error: appointmentError } = await supabase
    .from('appointments')
    .insert([{ ...body, user_id: userData?.user?.id }])
    .select('*') // This ensures the inserted data is returned
    .single();
  console.log('DATA', appointmentData);

  if (appointmentError || !appointmentData) {
    console.error('Error creating appointment:', appointmentError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create appointment.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('HERE', appointmentData);
  if (!appointmentData?.title || !appointmentData?.start_date || !appointmentData?.end_date) {
    return new NextResponse(JSON.stringify({ error: 'Incomplete appointment data.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const calendar = google.calendar('v3');
  const event = {
    summary: appointmentData?.title,
    description: appointmentData?.note || '', // Ensure description is an empty string if note is undefined or empty
    start: {
      dateTime: appointmentData?.start_date,
    },
    end: {
      dateTime: appointmentData?.end_date,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  try {
    const res = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      requestBody: event,
    });

    if (!res?.data || !res?.data?.id) {
      console.error('Failed to create Google Calendar event:', res);
      return new NextResponse(JSON.stringify({ error: 'Failed to create Google Calendar event.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log('Google Calendar Event Created:', res?.data);

    const { data: updatedAppointmentData, error: updateError } = await supabase
      .from('appointments')
      .update({
        google_event_id: res?.data?.id,
      })
      .match({
        appointment_id: appointmentData?.appointment_id,
      })
      .single();

    if (updateError) {
      console.error('Error updating appointment with Google event ID:', updateError);
      return new NextResponse(JSON.stringify({ error: 'Failed to update appointment with Google event ID.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(updatedAppointmentData), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error during Google Calendar event creation:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
