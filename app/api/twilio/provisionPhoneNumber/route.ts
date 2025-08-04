// app/api/twilio/provisionPhoneNumber/route.ts
// Twilio documentation for provisioning a phone number: https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource

import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { getTwilioClientForUser } from '../utils';

export async function POST(request: NextRequest) {
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

  // Parse the request body to get the phone number to provision
  const body = await request.json();
  const { phoneNumber } = body;

  if (!phoneNumber) {
    return new NextResponse(JSON.stringify({ error: 'Phone number is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Provision the phone number for the user
  try {
    const provisionedNumber = await twilioClient.incomingPhoneNumbers.create({
      phoneNumber: phoneNumber,
      // Additional options can be added here if needed
    });

    return new NextResponse(JSON.stringify(provisionedNumber), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error provisioning phone number:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to provision phone number' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}