import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { getTwilioClientForUser } from '../utils';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  // Retrieve the user from the Supabase auth session
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching user:', userError);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch user.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const user = data?.user;

  if (!user) {
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

  let createApplicationResponse;
  try {
    createApplicationResponse = await twilioClient.applications.create({
      voiceUrl: process.env.TWILIO_VOICE_URL,
      voiceMethod: 'POST',
      smsMethod: 'POST',
      smsUrl: process.env.TWILIO_SMS_URL,
      friendlyName: `TwilML Calling App for ${user.email} - ${user.id}`,
      statusCallback: process.env.TWILIO_VOICE_STATUS_CALLBACK_URL,
      statusCallbackMethod: "POST"
    });
  } catch (error) {
    console.error('Error creating Twilio application:', error);
    // Log the error in the twilio_subaccounts table
    await supabase.from('twilio_subaccounts').update({
      twiml_application: { error: error?.message }
    }).eq('user_id', user.id);

    return new NextResponse(JSON.stringify({ error, message: 'Failed to create Twilio application' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Store the data in the supabase tables under the twiml_application jsonb column in the twilio_subaccounts table
  const { error: updateError } = await supabase.from('twilio_subaccounts').update({
    twiml_application: createApplicationResponse
  }).eq('user_id', user.id);

  if (updateError) {
    console.error('Error updating twilio_subaccounts:', updateError);
    return new NextResponse(JSON.stringify({ error: updateError.message, message: 'Failed to update twilio_subaccounts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Return back the account_sid and the sid of the application
  return new NextResponse(JSON.stringify({
    account_sid: createApplicationResponse.accountSid,
    application_sid: createApplicationResponse.sid
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}