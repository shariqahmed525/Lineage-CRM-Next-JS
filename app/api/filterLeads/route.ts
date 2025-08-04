import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';


export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  const body = await request.json();
  const { filters } = body; // Get the filters from body

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

  // Build the query with filters, including joins for persons and locations
  let query = supabase
    .from('leads')
    .select(`
    *,
    leads_persons:leads_persons(
      person_id,
      persons:persons(
        first_name,
        last_name,
        spouse_name,
        phone1,
        phone2,
        age,
        called_phone1,
        called_phone2,
        spouse_age,
        person_id,
        email_address
      )
    ),
    leads_locations:leads_locations(
      location_id,
      locations:locations(
        lat,
        lng,
        street_address,
        street_address2,
        city,
        state_code,
        zip,
        county_id,
        location_result_type,
        location_id,
        user_id
      )
    )
  `)
    .eq('user_id', user.user.id);


  if (filters?.leadStatus) {
    query = query.eq('lead_status_id', filters.leadStatus);
  }
  if (filters?.leadType) {
    query = query.eq('lead_source_id', filters.leadType);
  }
  if (filters?.dateReceived) {
    query = query.gte('date_received', filters.dateReceived);
  }
  if (filters?.state) {
    query = query.ilike('leads_locations.locations.state_code', `%${filters.state}%`);
  }
  if (filters?.county) {
    query = query.ilike('leads_locations.locations.county_id', `%${filters.county}%`);
  }
  if (filters?.city) {
    query = query.ilike('leads_locations.locations.city', `%${filters.city}%`);
  }
  if (filters?.zip) {
    query = query.ilike('leads_locations.locations.zip', `%${filters.zip}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error filtering leads:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to filter leads.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Transform the data to match the expected format
  const transformedData = data?.map(lead => ({
    ...lead,
    leads_persons: lead?.persons?.map(person => ({
      persons: {
        ...person,
        // Add any missing properties here, example:
        age: person?.age,
        phone1: person?.phone1,
        phone2: person?.phone2,
        last_name: person?.last_name,
        person_id: person?.id,
        first_name: person?.first_name,
        spouse_age: person?.spouse_age,
        spouse_name: person?.spouse_name,
        called_phone1: person?.called_phone1,
        called_phone2: person?.called_phone2,
        email_address: person?.email_address,
      },
      person_id: person?.id,
    })) || [],
    leads_locations: lead?.locations?.map(location => ({
      locations: {
        ...location,
        // Add any missing properties here, example:
        lat: location?.lat,
        lng: location?.lng,
        zip: location?.zip,
        city: location?.city,
        user_id: location?.user_id,
        county_id: location?.county_id,
        state_code: location?.state_code,
        location_id: location?.id,
        street_address: location?.street_address,
        street_address2: location?.street_address2,
        location_result_type: location?.location_result_type,
      },
      location_id: location?.id,
    })) || [],
    persons: lead?.persons || [],
    locations: undefined, // Remove the locations key as it's not present in the getLeads output
  }));

  return new NextResponse(JSON.stringify(transformedData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
