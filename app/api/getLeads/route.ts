import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { Lead } from '@/types/databaseTypes';


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

  const searchQuery = request.nextUrl.searchParams.get('searchQuery');
  const filters = request.nextUrl.searchParams.get('filters');
  console.log('Filters', filters);
  const filterParams = filters ? JSON.parse(filters) : null;

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
          county,
          location_result_type,
          location_id,
          user_id
        )
      )
    `)
    .eq('user_id', user.user.id);

  if (searchQuery) {
    const searchTerms = searchQuery.split('+').map(term => `%${term}%`);
    query = supabase
      .from('search_leads')
      .select('lead_id')
      .textSearch('fts', searchTerms.join(' & '), { type: 'websearch' })
      .then(({ data: searchResults, error: searchError }) => {
        if (searchError) {
          throw searchError;
        }
        const leadIds = searchResults?.map(result => result.lead_id) || [];
        return supabase
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
                county,
                location_result_type,
                location_id,
                user_id
              )
            )
          `)
          .in('id', leadIds)
          .eq('user_id', user.user.id);
      });
  }
  console.log('And here are the filter params', filterParams);
  if (filterParams) {
    if (filterParams.leadStatus && filterParams.leadStatus.length > 0) {
      query = query.in('lead_status_id', filterParams.leadStatus);
    }
    if (filterParams.leadType && filterParams.leadType.length > 0) {
      query = query.in('lead_source_id', filterParams.leadType);
    }
    if (filterParams.fromDate && filterParams.toDate) {
      query = query.gte('record_day', filterParams.fromDate).lte('record_day', filterParams.toDate);
    }
    if (filterParams.state && filterParams.state.length > 0) {
      const stateFilters = filterParams.state.flatMap(state => [state, state.toLowerCase(), state.toUpperCase()]);
      query = query.in('leads_locations.locations.state_code', stateFilters);
    }
    if (filterParams.city && filterParams.city.length > 0) {
      const cityFilters = filterParams.city.flatMap(city => [city, city.toLowerCase(), city.toUpperCase()]);
      query = query.in('leads_locations.locations.city', cityFilters);
    }
    if (filterParams.zip && filterParams.zip.length > 0) {
      query = query.in('leads_locations.locations.zip', filterParams.zip);
    }
  }

  const { data: leads, error: leadsError } = await query;

  if (leadsError) {
    console.error('Error fetching leads with related data:', leadsError);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch leads with related persons.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Transform the data to nest persons directly under each lead
  const transformedLeads = leads?.map(lead => ({
    ...lead,
    persons: lead.leads_persons?.map(join => join.persons) || [],
  }));

  return new NextResponse(JSON.stringify(transformedLeads), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
