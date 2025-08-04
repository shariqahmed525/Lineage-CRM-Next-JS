import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
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

  const { data: filters, error: filtersError } = await supabase
    .from('leads_filters')
    .select('*')
    .eq('user_id', user?.user?.id);

  if (filtersError) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch filters.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(filters?.map((filter) => {
    try {
      return {
        ...filter,
        filters: JSON.parse(filter.filters), // Ensure this line correctly parses the JSON string
      };
    } catch (e) {
      console.error('Failed to parse filter:', filter.filters);
      return filter;
    }
  })), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
