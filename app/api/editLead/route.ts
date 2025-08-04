// app/api/editLead/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { Lead } from '@/types/databaseTypes';

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const lead: Lead = body;
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data, error } = await supabase
    .from('leads')
    .update(lead)
    .match({ id: lead.id })
    .select()

  if (error) {
    console.error('Error editing lead:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to edit lead.' }), {
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
