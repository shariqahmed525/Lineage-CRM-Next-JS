// app/api/handleSignOut/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to sign out.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ message: 'Successfully signed out.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
