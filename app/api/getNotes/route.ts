// app/api/getNotes/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lead_id = searchParams.get('lead_id');
  console.log('Elaine Bennis', lead_id);
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

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('lead_id', lead_id);

  if (error) {
    console.error('Error getting notes:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to get notes.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(notes), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
