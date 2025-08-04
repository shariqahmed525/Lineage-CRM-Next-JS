import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
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

  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('*')
    .eq('user_id', user?.user?.id);

  if (locationsError) {
    console.error('Error fetching locations:', locationsError);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch locations.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(locations), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}