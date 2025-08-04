// app/api/twilio/listPhoneNumbers/route.ts
// Twilio documentation for listing phone numbers: https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource

import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { getTwilioClientForUser } from '../utils';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  // Retrieve the user from the Supabase auth session
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Get the Twilio client for the user's subaccount
  let twilioClient;
  try {
    twilioClient = await getTwilioClientForUser(supabase);
  } catch (error) {
    console.error('Error getting Twilio client:', error);
    return new NextResponse(JSON.stringify({ error, message: 'Failed to get Twilio client' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Fetch the list of phone numbers associated with the user's account
  try {
    const phoneNumbersList = await twilioClient.incomingPhoneNumbers.list();

    return new NextResponse(JSON.stringify(phoneNumbersList), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error listing phone numbers:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to list phone numbers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
