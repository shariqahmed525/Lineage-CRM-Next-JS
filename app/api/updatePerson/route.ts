import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
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

  // Parse the request body to get the updated person data
  const personData = await request.json();

  // Update the person in the database
  const { data: updatedPerson, error: updateError } = await supabase
    .from('persons')
    .update(personData)
    .eq('person_id', personData.person_id)
    .eq('user_id', user.user.id)
    .single();

  if (updateError) {
    console.error('Error updating person:', updateError);
    return new NextResponse(JSON.stringify({ error: 'Failed to update person.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(updatedPerson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
