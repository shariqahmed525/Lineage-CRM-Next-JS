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

  // Fetch application statuses for the user
  const { data: applicationStatuses, error } = await supabase
    .from('application_status')
    .select('*');

  if (error) {
    console.error('Error fetching application statuses:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch application statuses.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  if (!applicationStatuses) {
    return new NextResponse(JSON.stringify({ error: 'No application statuses found.' }), {
      status: 204,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(applicationStatuses), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}