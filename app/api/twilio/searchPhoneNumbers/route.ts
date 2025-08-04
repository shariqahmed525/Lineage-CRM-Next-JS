// app/api/twilio/searchPhoneNumbers/route.ts
// Twilio documentation for searching available phone numbers: https://www.twilio.com/docs/phone-numbers/api/availablephonenumber-resource

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

  // Parse the request body to get search options
  const body = await request.json();
  const {
    inLocality,
    inRegion,
    inPostalCode,
    nearLatLong,
    inLata,
    areaCode,
  } = body;

  // Hard-code the country code as the U.S. and other search options
  const searchOptions = {
    type: 'local',
    smsEnabled: true,
    mmsEnabled: true,
    voiceEnabled: true,
    faxEnabled: true,
    excludeAllAddressRequired: true,
    distance: 50,
    ...(inLocality && { inLocality }),
    ...(inRegion && { inRegion }),
    ...(inPostalCode && { inPostalCode }),
    ...(nearLatLong && { nearLatLong }),
    ...(inLata && { inLata }),
    ...(areaCode && { areaCode }), // Include areaCode in the search options if provided
  };

  console.log('Search Options', searchOptions);

  // Search for available phone numbers
  try {
    const availableNumbers = await twilioClient.availablePhoneNumbers('US').local.list(searchOptions);

    return new NextResponse(JSON.stringify(availableNumbers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error searching for phone numbers:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to search for phone numbers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
