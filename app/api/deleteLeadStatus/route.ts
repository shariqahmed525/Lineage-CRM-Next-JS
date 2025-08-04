// app/api/deleteLeadStatus/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
  console.log("DEBUG: Entering DELETE function");
  const body = await request.json();
  const { status_id } = body;
  console.log(`DEBUG: Received status_id: ${status_id}`);
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  if (!status_id || typeof status_id !== 'string') {
    console.log("DEBUG: Invalid status_id provided");
    return new NextResponse(JSON.stringify({ error: 'A valid status_id is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { data, error } = await supabase
    .from('lead_statuses')
    .delete()
    .match({ status_id });

  if (error) {
    console.log(`DEBUG: Supabase error: ${error.message}`);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  console.log("DEBUG: Lead status deleted successfully", data);
  return new NextResponse(JSON.stringify({ message: 'Lead status deleted successfully', data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
