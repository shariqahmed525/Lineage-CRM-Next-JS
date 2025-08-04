import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  try {
    // Parse the request body to get the session data
    const { user_id, session_data, user_data } = await request.json();

    const { data, error } = await supabase
      .from('profile')
      .insert([
        { user_id: user_id, session_data: session_data, user_data: user_data },
      ])
      .select();

    if (error) {
      throw new Error(`Failed to save session data: ${JSON.stringify(error)}`);
    }

    return new NextResponse(JSON.stringify(data), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in POST /api/saveSessionData:', error);
    return new NextResponse(JSON.stringify({ error: 'An error occurred while processing your request.', details: JSON.stringify(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
