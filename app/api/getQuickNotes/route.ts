import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lead_id = searchParams.get('lead_id');
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

  const { data: lead, error } = await supabase
    .from('leads')
    .select('quick_note')
    .eq('id', lead_id)
    .single();

  if (error) {
    console.error('Error getting lead details:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to get lead details.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(lead), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
