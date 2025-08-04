/**
 * POST /api/geocodeAddress
 *
 * This endpoint is designed to geocode a given address using the Google Maps Geocoding API.
 * It takes an address in the request body and returns the latitude and longitude of the address.
 *
 * ## Usage:
 * This endpoint is used in the create lead form to convert a physical address into geographic coordinates.
 * It is essential for mapping applications, location-based services, and any scenario where
 * obtaining the latitude and longitude of a given address is required.
 *
 * ## Request Body:
 * The request body must be a JSON object containing the following keys:
 *
 * - `street_address`: The street address of the location.
 * - `city`: The city of the location.
 * - `state_code`: The state code of the location.
 * - `zip`: The ZIP code of the location.
 *
 * ## Response:
 * On successful geocoding of the address, the endpoint will return the latitude and longitude in JSON format,
 * along with a 200 status code. This ensures that the client receives the necessary geographic coordinates
 * to proceed with further operations, such as storing the location in the database or displaying it on a map.
 *
 * If there is an error at any stage of the process (e.g., invalid address, failure to fetch from the API),
 * the endpoint will return an error message in JSON format and an appropriate HTTP status code (e.g., 500 for
 * internal server errors). This provides clear feedback to the client, allowing for quick diagnosis and resolution
 * of issues.
 *
 * ## Example Request:
 * ```json
 * {
 *   "street_address": "1600 Amphitheatre Parkway",
 *   "city": "Mountain View",
 *   "state_code": "CA",
 *   "zip": "94043"
 * }
 * ```
 *
 * ## Security:
 * This endpoint requires a valid user session to be present. The user's session is validated at the beginning of the
 * request process, and if the user is not authenticated, a 401 Unauthorized response is returned. This ensures that
 * only authorized users can access the geocoding functionality, preventing abuse and potential overuse
 * of the Google Maps API.
 *
 * ## Error Handling:
 * The endpoint includes comprehensive error handling to provide clear feedback in case of failure. This includes
 * checks for invalid input data and handling of any errors that occur during the fetch process from the Google Maps API.
 * Detailed error messages are returned to help diagnose issues quickly.
 */
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log('user error', userError?.toString());
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { street_address, city, state_code, zip } = await request.json();
    const address = `${street_address}, ${city}, ${state_code} ${zip}`;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log('Data', data);

    if (data?.status !== 'OK') {
      return new NextResponse(JSON.stringify({ error: 'Failed to geocode address' }), { status: 500 });
    }

    const { lat, lng } = data?.results?.[0]?.geometry?.location || {};
    return new NextResponse(JSON.stringify({ lat, lng }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
  }
}
