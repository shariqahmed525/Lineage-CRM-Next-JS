/**
 * POST /api/createLead
 *
 * This endpoint is designed for the creation of a single lead along with associated person and location details.
 * It is specifically tailored for scenarios where a lead, along with its related person and location information,
 * needs to be added to the database individually. This is in contrast to bulk uploading, which is handled by a different
 * endpoint designed for processing multiple leads at once. The endpoint ensures that all related entities are correctly
 * linked in the database, including updating joiner tables (`leads_persons` and `leads_locations`) to maintain the
 * integrity of relationships between leads, persons, and locations.
 *
 * ## Usage:
 * This endpoint should be used when a new lead is generated that requires immediate entry into the database along with
 * detailed information about the person and location associated with the lead. It is ideal for use cases such as
 * form submissions on a website, where a user inputs their information which then directly creates a new lead.
 *
 * ## Request Body:
 * The request body must be a JSON object containing the following keys:
 *
 * - `leadDetails`: An object containing all the information necessary to create a lead. This includes any fields
 *   defined in the `leads` table schema such as `lead_type`, `date_received`, etc.
 * - `personDetails`: An object containing information about the person associated with the lead. This should match
 *   the schema of the `persons` table and include fields like `first_name`, `last_name`, `phone1`, etc.
 * - `locationDetails`: An object with details about the location associated with the lead. It should adhere to the
 *   `locations` table schema, including fields such as `street_address`, `city`, `state_code`, `county`, etc.
 *
 * ## Response:
 * On successful creation of the lead, person, and location, the endpoint will return the complete row for the new
 * entry in the Leads table in JSON format, along with a 201 status code.
 *
 * If there is an error at any stage of the process (e.g., unauthorized access, failure to insert into the database),
 * the endpoint will return an error message in JSON format and an appropriate HTTP status code (e.g., 401 for
 * unauthorized, 500 for internal server errors).
 *
 * ## Example Request:
 * ```json
 * {
 *   "leadDetails": {
 *     "lead_type": "Web Form",
 *     "date_received": "2023-04-12",
 *     ...
 *   },
 *   "personDetails": {
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     ...
 *   },
 *   "locationDetails": {
 *     "street_address": "123 Main St",
 *     "city": "Anytown",
 *     "county": "Anycounty",
 *     ...
 *   }
 * }
 * ```
 *
 * ## Security:
 * This endpoint requires a valid user session to be present. The user's session is validated at the beginning of the
 * request process, and if the user is not authenticated, a 401 Unauthorized response is returned. This ensures that
 * only authorized users can create new leads, persons, and locations in the database.
 *
 * ## Error Handling:
 * The endpoint includes comprehensive error handling to provide clear feedback in case of failure. This includes
 * checks for unauthorized access, validation of input data against the database schema, and handling of any errors
 * that occur during the insertion process into the database. Detailed error messages are returned to help diagnose
 * issues quickly.
 */
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log('user error', userError?.toString())
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const body = await request.json();
  const { leadDetails, personDetails, locationDetails } = body;
  console.log('boom', personDetails, body);
  // Insert the new person into the database
  const { data: newPerson, error: personError } = await supabase
    .from('persons')
    .insert([
      { ...personDetails, user_id: user.user.id },
    ])
    .select();

  if (personError) {
    console.error('Error inserting new person:', personError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create new person.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('Homer is adding a new person to Springfield', newPerson);

  // Insert the new location into the database
  const { data: newLocation, error: locationError } = await supabase
    .from('locations')
    .insert([
      { ...locationDetails, user_id: user.user.id },
    ])
    .select();

  if (locationError) {
    console.error('Error inserting new location:', locationError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create new location.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('Marge is mapping out a new location in Springfield', newLocation);

  // Insert the new lead into the database
  const { data: newLead, error: leadError } = await supabase
    .from('leads')
    .insert([
      { ...leadDetails, user_id: user.user.id },
    ])
    .select();

  if (leadError) {
    console.error('Error inserting new lead:', leadError);
    return new NextResponse(JSON.stringify({ error: 'Failed to create new lead.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('Bart is skateboarding through the new leads', newLead, leadError);

  // Associate the new person and location with the lead in the join tables
  const { data: newLeadsPersons, error: leadsPersonsError } = await supabase
    .from('leads_persons')
    .insert([
      { lead_id: newLead?.[0]?.id, person_id: newPerson?.[0]?.person_id, user_id: user.user.id },
    ])
    .select();

  if (leadsPersonsError) {
    console.error('Error linking person to lead:', leadsPersonsError);
    return new NextResponse(JSON.stringify({ error: 'Failed to link new person with lead.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('Lisa is connecting people with leads in Springfield', newLeadsPersons);

  const { data: newLeadsLocations, error: leadsLocationsError } = await supabase
    .from('leads_locations')
    .insert([
      { lead_id: newLead?.[0]?.id, location_id: newLocation?.[0]?.location_id, user_id: user.user.id },
    ])
    .select();

  if (leadsLocationsError) {
    console.error('Error linking location to lead:', leadsLocationsError);
    return new NextResponse(JSON.stringify({ error: 'Failed to link new location with lead.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('Maggie is silently observing the new locations being linked to leads', newLeadsLocations);

  // Prepare the response object in the desired format
  const response = {
    id: newLead?.[0]?.id,
    record_day: newLead?.[0]?.date_created,
    user_id: user.user.id,
    date_received: newLead?.[0]?.date_received,
    lead_status_id: newLead?.[0]?.lead_status_id,
    lead_type: newLead?.[0]?.lead_type,
    quick_note: newLead?.[0]?.quick_note,
    attachment: newLead?.[0]?.attachment,
    url_link: newLead?.[0]?.url_link,
    date_created: newLead?.[0]?.date_created,
    lead_source_id: newLead?.[0]?.lead_source_id,
    leads_persons: [
      {
        persons: {
          ...newPerson?.[0],
        },
        person_id: newPerson?.[0]?.id,
      },
    ],
    leads_locations: [
      {
        locations: {
          ...newLocation?.[0],
        },
        location_id: newLocation?.[0]?.id,
      },
    ],
    persons: newPerson?.[0] ? [newPerson?.[0]] : [],
  };

  // Return the response with the 201 status code
  return new NextResponse(JSON.stringify(response), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
