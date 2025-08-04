// app/api/getTasks/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) {
    console.error('Error fetching tasks:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch tasks.' }), {
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
