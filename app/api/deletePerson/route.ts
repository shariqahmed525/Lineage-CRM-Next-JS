import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
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

  // Parse the request URL to get the person_id
  const url = new URL(request.url);
  const personId = url.searchParams.get('person_id');

  if (!personId) {
    return new NextResponse(JSON.stringify({ error: 'Person ID is required.' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Delete the person from the database
  const { error: deleteError } = await supabase
    .from('persons')
    .delete()
    .eq('person_id', personId)
    .eq('user_id', user.user.id);

  if (deleteError) {
    console.error('Error deleting person:', deleteError);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete person.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Optionally, update the leads_persons join table to remove the association
  // This step depends on the business logic and how you want to handle the deletion of persons associated with leads
  const { error: joinTableError } = await supabase
    .from('leads_persons')
    .delete()
    .eq('person_id', personId);

  if (joinTableError) {
    console.error('Error updating leads_persons join table:', joinTableError);
    return new NextResponse(JSON.stringify({ error: 'Failed to update leads_persons association.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return new NextResponse(JSON.stringify({ message: 'Person deleted successfully.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}