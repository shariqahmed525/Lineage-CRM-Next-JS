import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
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

  const { data: twilioData, error: twilioError } = await supabase
    .from('twilio_subaccounts')
    .select('*')
    .eq('user_id', user.id)
    .single();
  // Check if there was an error while fetching the Twilio subaccount
  if (twilioError) {
    // If the error code is 'PGRST116', it means no rows were found in the database for the given query.
    // This is a specific case where the user has not enabled calling, hence we return a custom response.
    if (twilioError.code === 'PGRST116') {
      return new NextResponse(JSON.stringify({ code: "calling_disabled" }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // For any other error, log the error and return a generic error response.
      console.error('Error fetching Twilio subaccount:', twilioError);
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch Twilio subaccount.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  return new NextResponse(JSON.stringify(twilioData || {}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}