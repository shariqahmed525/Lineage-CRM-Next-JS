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

  // Fetch all persons associated with the user's ID, including the lead_id from the leads_persons table
  const { data: persons, error: personsError } = await supabase
    .from('persons')
    .select(`
      *,
      leads_persons!inner(lead_id)
    `)
    .eq('user_id', user.user.id);

  if (personsError) {
    console.error('Error fetching persons:', personsError);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch persons.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(persons), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}