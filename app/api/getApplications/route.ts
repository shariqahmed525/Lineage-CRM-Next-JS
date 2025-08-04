// app/api/getApplications/route.ts
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

  // Fetch applications for the user using the correct user_id foreign key
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user?.user?.id); // Use user_id to fetch applications

  if (error) {
    console.error('Error fetching applications:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch applications.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(applications), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}