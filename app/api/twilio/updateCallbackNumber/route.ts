import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { getTwilioClientForUser } from '../utils';

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { callbackNumber } = body;

  if (!callbackNumber) {
    return new NextResponse(JSON.stringify({ error: 'Callback number is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const phoneNumbersList = await twilioClient.incomingPhoneNumbers.list();
    await Promise.all(phoneNumbersList?.map(phoneNumber => twilioClient.incomingPhoneNumbers(phoneNumber.sid).update({
      voiceUrl: `${process.env.INCOMING_CALL_URL}?userId=${user.user.id}&callbackNumber=${callbackNumber}`,
    })));

    // Upsert to the callback_phone_numbers table
    const { error } = await supabase
      .from('callback_phone_numbers')
      .upsert([
        { user_id: user.user.id, phone_number: callbackNumber },
      ]);

    return new NextResponse(JSON.stringify({ success: 'Callback numbers updated successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating callback numbers:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update callback numbers' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
