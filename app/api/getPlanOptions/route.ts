import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  // Retrieve the user from the Supabase auth session
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Fetch plan information from multiple tables
  const tables = ['plan_coverage_type', 'plan_payment_day', 'plan_payment_method', 'plan_payment_mode'];
  const planInformation: { [key: string]: any } = {};

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return new NextResponse(JSON.stringify({ error: `Failed to fetch data from ${table}.` }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    planInformation[table] = data;
  }

  return new NextResponse(JSON.stringify(planInformation), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}