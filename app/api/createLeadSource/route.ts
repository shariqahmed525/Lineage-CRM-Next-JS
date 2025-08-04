// app/api/createLeadSource/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { Tables } from '@/types/types';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError || 'User not found');
    return new NextResponse(JSON.stringify({ error: 'Failed to get user.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const body = await request.json();
  const leadSource: Tables<'lead_sources'> = {
    ...body,
    user_id: user.user.id, // Include the user ID in the new lead source
  };

  const { data, error } = await supabase
    .from('lead_sources')
    .insert([leadSource])
    .select()
    .limit(1)
    .single()

  if (error) {
    console.error('Error creating lead source:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create lead source.' }), {
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