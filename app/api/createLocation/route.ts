import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

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

  const locationData = await request.json();

  const { data: location, error: locationError } = await supabase
    .from('locations')
    .insert([
      { ...locationData, user_id: user.user.id }
    ]);

  if (locationError) {
    console.error('Error creating location:', locationError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create location.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(location), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}