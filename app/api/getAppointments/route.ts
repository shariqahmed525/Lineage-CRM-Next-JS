import { endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Json } from "@/types/database.types";
import { createSupabaseClient } from '@/utils/supabase/server';

type SessionData = {
   provider_token?: string;
   provider_refresh_token?: string;
} & Json

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createSupabaseClient(cookieStore);
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const current_date = searchParams.get('q');

    if (!current_date) {
      return NextResponse.json<JsonBodyError>({ error: 'BadRequest', message: 'current_date search param is required' }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return NextResponse.json<JsonBodyError>({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profileData } = await supabase
      .from('profile')
      .select('session_data')
      .eq('user_id', userData.user.id)
      .single();

    const { provider_token, provider_refresh_token } = profileData?.session_data as SessionData;

    const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    auth.setCredentials({
      access_token: provider_token,
      refresh_token: provider_refresh_token,
      scope: 'https://www.googleapis.com/auth/calendar',
    });
    
    const parsedStartDate = parseISO(current_date);
    const startOfMonthDay = startOfMonth(parsedStartDate);
    const endOfMonthDay = endOfMonth(parsedStartDate);

    const calendar = google.calendar('v3');
    const events = await calendar.events.list({
      auth,
      calendarId: 'primary',
      timeMin: startOfMonthDay.toISOString(),
      timeMax: endOfMonthDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    if (!events || !events.data?.items || events.data.items.length === 0) {
      return NextResponse.json<JsonBodyError>({ error: 'InternalServerError', message: 'Failed to fetch Google Calendar events.' }, { status: events.status });
    }

    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('appointment_id, title, start_date, end_date, google_event_id, last_fetch')
      .eq('user_id', userData.user.id);

    const updates: Omit<Appointment, 'lead_id' | 'note' | 'google_event_id'>[] = [];
    const inserts: Omit<Appointment, 'lead_id' | 'note' | 'appointment_id'>[] = [];
    
    for (const googleEvent of events.data.items) {
      const existingAppointment = existingAppointments?.find(appointment => appointment.google_event_id === googleEvent.id);

      if (existingAppointment) {
        if (new Date(googleEvent.updated!).getTime() > new Date(existingAppointment.last_fetch!).getTime()) {
          updates.push({
            user_id: userData.user.id,
            appointment_id: existingAppointment.appointment_id,
            title: googleEvent.summary!,
            start_date: googleEvent.start?.dateTime!,
            end_date: googleEvent.end?.dateTime!,
            last_fetch: new Date().toISOString()
          });
        }

      } else {
        inserts.push({
          user_id: userData.user.id,
          title: googleEvent.summary!,
          start_date: googleEvent.start?.dateTime!,
          end_date: googleEvent.end?.dateTime!,
          google_event_id: googleEvent.id!,
          last_fetch: new Date().toISOString()
        });
      }
    }

    // Perform batch updates and inserts
    await Promise.allSettled([
      supabase.from('appointments').upsert(updates),
      supabase.from('appointments').insert(inserts),
    ])

    const { data: appointments } = await supabase
      .from('appointments')
      .select('appointment_id, title, start_date, end_date')
      .eq('user_id', userData.user.id)
      .gte('start_date', startOfMonthDay.toISOString())
      .lte('end_date', endOfMonthDay.toISOString());

    return NextResponse.json<JsonBodySuccess<Pick<Appointment, 'appointment_id' | 'title' | 'start_date' | 'end_date'>[]>>({ 
      success: true, 
      data: appointments ?? [] 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json<JsonBodyError>({ error: 'InternalServerError', message: 'Failed to fetch appointments.' }, { status: 500 });
  }
}
