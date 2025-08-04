// app/api/createApplication/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
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

  // Parse the request body to get application data
  const body = await request.json();
  const applicationData = {
    ...body,
    user_id: user?.user?.id // Correctly associate the application with the user's ID
  };

  // Insert the new application into the database
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData]);

  if (error) {
    console.error('Error creating application:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create application.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}