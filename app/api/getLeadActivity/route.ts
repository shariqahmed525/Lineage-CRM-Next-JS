// app/api/getLeadActivity/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lead_id = searchParams.get('lead_id');
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

  const { data: activities, error } = await supabase
    .from('activity')
    .select('*')
    .eq('lead_id', lead_id);

  if (error) {
    console.error('Error getting activities:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to get activities.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(activities), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
