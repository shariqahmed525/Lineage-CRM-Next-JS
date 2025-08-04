import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Log every parameter in the URL params
    const url = new URL(request.url);
    console.log('URL Parameters:', Array.from(url.searchParams.entries()));

    // Log every element in the body of the request
    let body = '';
    const reader = request.body?.getReader();
    if (reader) {
      let result = await reader.read();
      while (!result.done) {
        body += new TextDecoder('utf-8').decode(result.value);
        result = await reader.read();
      }
    }
    console.log('Body:', body);

    // Access Supabase client
    const cookieStore = cookies();
    const supabase = createSupabaseClient(cookieStore);

    // Extract userId and callbackNumber from URL parameters
    const userId = url.searchParams.get('userId');
    const callbackNumber = url.searchParams.get('callbackNumber');

    // Convert the body string into a URLSearchParams object
    const params = new URLSearchParams(body);

    // Convert URLSearchParams into a plain object
    const bodyObject = Array.from(params.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Upsert to the incoming_calls table
    await supabase
      .from('incoming_calls')
      .insert([
        {
          call_details: { ...bodyObject },
          user_id: userId,
          callback_number: callbackNumber,
        },
      ]);

    // Respond back with a valid TWIML response
    const { VoiceResponse } = twilio.twiml;
    const twiml = new VoiceResponse();
    twiml.dial(`+1${callbackNumber}`);

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to process request.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
