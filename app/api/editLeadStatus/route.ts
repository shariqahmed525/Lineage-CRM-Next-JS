import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { LeadStatus } from '@/types/databaseTypes';

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { status_id, ...fields }: { status_id: string, badge_color_hexcode: string } = body;
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  if (!status_id || typeof status_id !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'A valid status_id is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { data, error } = await supabase
    .from('lead_statuses')
    .upsert([{ status_id, ...fields }]);

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: 'Lead status updated successfully', data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
