import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
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
  const locationId = locationData.location_id;
  delete locationData.location_id;

  const { error: updateError } = await supabase
    .from('locations')
    .update(locationData)
    .eq('location_id', locationId)
    .eq('user_id', user.user.id);

  if (updateError) {
    console.error('Error updating location:', updateError);
    return new NextResponse(JSON.stringify({ error: 'Failed to update location.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}