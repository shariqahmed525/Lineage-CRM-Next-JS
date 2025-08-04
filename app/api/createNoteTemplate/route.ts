import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const { leadId, note } = await request.json();
  const supabase = createSupabaseClient(request);

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('note_templates')
    .insert({
      template_id: uuidv4(),
      lead_id: leadId,
      note,
      created_at: new Date().toISOString(),
      created_by: user.user.id,
    });

  if (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to create note template.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
