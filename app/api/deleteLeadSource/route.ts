// app/api/deleteLeadSource/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { id } = await request.json();

  const { error } = await supabase
    .from('lead_sources')
    .delete()
    .match({ id });

  if (error) {
    console.error('Error deleting lead source:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete lead source.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: 'Lead source deleted successfully.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
