// app/api/createLeadStatus/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { LeadStatus } from '@/types/databaseTypes';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { status_name, badge_color_hexcode }: { status_name: string, badge_color_hexcode: string } = body;
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data, error } = await supabase
    .from('lead_statuses')
    .insert(
      { status_name, badge_color_hexcode }
    )
    .select()


  if (error) {
    console.error('Error creating lead status:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create lead status.' }), {
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
