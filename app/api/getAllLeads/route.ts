import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  // Modified query to include related persons and locations
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      persons:leads_persons!inner(person_id),
      locations:leads_locations!inner(location_id)
    `);

  if (error) {
    console.error('Error fetching all leads:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch all leads.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}