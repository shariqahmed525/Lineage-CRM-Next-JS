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

  // Fetch carriers
  const { data: carriers, error } = await supabase
    .from('carriers')
    .select('*');

  if (error) {
    console.error('Error fetching carriers:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch carriers.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(carriers), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}