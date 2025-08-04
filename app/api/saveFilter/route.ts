import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const {
    name, leadStatus, leadType, state, fromDate, toDate, dateReceived, county, city, zip,
  } = await request.json();

  const filters = {
    leadStatus: leadStatus || [],
    leadType: leadType || [],
    state: state || [],
    fromDate: fromDate || null,
    toDate: toDate || null,
    dateReceived: dateReceived || null,
    county: county || [],
    city: city || [],
    zip: zip || [],
  };

  const { data: existingFilter, error: existingFilterError } = await supabase
    .from('leads_filters')
    .select('id')
    .eq('user_id', user.user.id)
    .eq('name', name)
    .single();

  if (existingFilter) {
    return new NextResponse(JSON.stringify({ error: `Filter with Name ${name} Already Exists! Please Rename.` }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { error: insertError } = await supabase
    .from('leads_filters')
    .insert({
      user_id: user.user.id,
      name,
      filters,
    });

  if (insertError) {
    return new NextResponse(JSON.stringify({ error: 'Failed to save filter.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: 'Filter saved successfully.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
