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

  const apiKeyResponse = await twilioClient.newKeys.create({ friendlyName: `${user.user.email}'s API Key` });
  const { error: apiKeyError } = await supabase.from('twilio_subaccounts').update({
    api_key: apiKeyResponse
  }).eq('user_id', user.user.id);

  if (apiKeyError) {
    console.error('Error saving API key to twilio_subaccounts:', apiKeyError);
    return new NextResponse(JSON.stringify({ error: apiKeyError.message, message: 'Failed to save API key to twilio_subaccounts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create a new API key in Twilio for the subaccount
  try {
    const newKey = await twilioClient.newKeys.create({ friendlyName: `${user.user.email}'s API Key` });
    return new NextResponse(JSON.stringify({ newKey }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error creating new Twilio API key:', error);
    return new NextResponse(JSON.stringify({ error, message: 'Failed to create new Twilio API key' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}