// app/api/twilio/deletePhoneNumber/route.ts
// Twilio documentation for deleting a phone number: https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource#delete-a-incomingphonenumber-resource

import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { getTwilioClientForUser } from '../utils';

export async function DELETE(request: NextRequest) {
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

  // Parse the request body to get the phone number SID to delete
  const body = await request.json();
  const { phoneNumberSid } = body;

  if (!phoneNumberSid) {
    return new NextResponse(JSON.stringify({ error: 'Phone number SID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Delete the phone number from the user's account
  try {
    await twilioClient.incomingPhoneNumbers(phoneNumberSid).remove();

    return new NextResponse(JSON.stringify({ success: 'Phone number deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting phone number:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete phone number' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
