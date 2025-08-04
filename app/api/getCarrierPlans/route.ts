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

  // Fetch carrier plans
  const { data: carrierPlans, error } = await supabase
    .from('carrier_plans')
    .select('*');

  if (error) {
    console.error('Error fetching carrier plans:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch carrier plans.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(carrierPlans), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}