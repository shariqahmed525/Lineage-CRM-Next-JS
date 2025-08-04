import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

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

  // Fetch callback phone numbers for the authenticated user
  const { data: callbackPhoneNumbers, error: callbackNumbersError } = await supabase
    .from('callback_phone_numbers')
    .select('*')
    .eq('user_id', user.user.id);

  if (callbackNumbersError) {
    console.error('Error fetching callback phone numbers:', callbackNumbersError);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch callback phone numbers.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(callbackPhoneNumbers), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
