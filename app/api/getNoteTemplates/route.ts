import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createSupabaseClient(request);

  const { data, error } = await supabase
    .from('note_templates')
    .select('note');

  if (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch note templates.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}