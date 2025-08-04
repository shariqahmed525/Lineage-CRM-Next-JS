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

  // Parse the request body to get the person data and optionally a lead_id
  const { lead_id, ...personDetails } = await request.json();
  console.log({ ...personDetails, user_id: user?.user?.id });
  // Insert the new person into the database, excluding the lead_id
  const { data: newPerson, error: insertError } = await supabase
    .from('persons')
    .insert([
      { ...personDetails, user_id: user?.user?.id },
    ])
    .select();

  console.log('And here comes the data', newPerson, insertError);

  if (insertError) {
    console.error('Error inserting new person:', insertError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create new person.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // If a lead_id is present, associate the new person with the lead in the leads_persons join table
  if (lead_id) {
    const { error: joinTableError } = await supabase
      .from('leads_persons')
      .insert([
        { lead_id: lead_id, person_id: newPerson?.[0]?.person_id, user_id: user?.user?.id },
      ]);

    if (joinTableError) {
      console.error('Error inserting into leads_persons join table:', joinTableError);
      return new NextResponse(JSON.stringify({ error: 'Failed to associate person with lead.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return new NextResponse(JSON.stringify(newPerson), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
