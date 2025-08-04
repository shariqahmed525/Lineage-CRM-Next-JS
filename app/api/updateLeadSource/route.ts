// app/api/updateLeadSource/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { Tables } from '@/types/types'; // Using the same type as in @route.ts

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const body = await request.json();
  const leadSource: Tables<'lead_sources'> = body; // Correct type definition
  
  const { data, error } = await supabase
    .from('lead_sources')
    .update(leadSource)
    .eq('id', leadSource.id)
    .single();

  if (error) {
    console.error('Error updating lead source:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update lead source.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}