import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

import { getTwilioClientForUser } from '../utils';

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

  // Get the Twilio client for the user's subaccount
  let twilioClient;
  try {
    twilioClient = await getTwilioClientForUser(supabase);
  } catch (error) {
    console.error('Error getting Twilio client:', error);
    return new NextResponse(JSON.stringify({ error, message: 'Failed to get Twilio client' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Use the Twilio client to list all recordings and fetch call details
  try {
    const recordings = await twilioClient.recordings.list({});
    const recordingsWithCallDetails = await Promise.all(recordings?.map(async (recording) => {
      const childCalls = await twilioClient.calls.list({
        parentCallSid: recording?.callSid,
      });

      let call = {};
      if (childCalls.length > 0) {
        call = childCalls[0];
      }
      console.log('recording object', recording);
      console.log('call object', call);

      let leadInfo = {};
      let personData = {}; // Define personData here
      let locationInfo = {}; // Define locationInfo here
      try {
        const cleanedToPhone = call?.to?.startsWith('+1') ? call.to.substring(2) : call?.to;
        // Fetch personData inside try block as before
        const { data, error: personError } = await supabase
          .from('persons')
          .select('*') // Adjusted to select all columns
          .or(`phone1.eq.${cleanedToPhone},phone2.eq.${cleanedToPhone}`)
          .single();

        if (personError || !data) {
          console.error('Error fetching person info:', personError);
          return;
        }

        personData = data; // Assign fetched data to personData

        // Fetch the lead information using the person_id from personData
        const { data: leadData, error: leadError } = await supabase
          .from('leads_persons')
          .select(`
            lead_id,
            leads:leads(*)
          `)
          .eq('person_id', personData.person_id)
          .single();

        if (leadError || !leadData) {
          console.error('Error fetching lead info:', leadError);
        } else {
          leadInfo = leadData.leads;
        }

        // Fetch location information based on the lead_id
        const { data: locationData, error: locationError } = await supabase
          .from('leads_locations')
          .select(`
            location_id,
            locations:locations(*)
          `)
          .eq('lead_id', leadInfo?.id) // Assuming leadInfo contains lead_id
          .single();

        if (locationError || !locationData) {
          console.error('Error fetching location info:', locationError);
        } else {
          locationInfo = locationData.locations;
        }
      } catch (error) {
        console.error('Error searching for lead or location:', error);
      }

      // Return object, including personData and locationInfo
      return {
        dateCreated: recording?.dateCreated,
        sid: recording?.sid,
        duration: recording?.duration,
        callSid: recording?.callSid,
        mediaUrl: recording?.mediaUrl,
        accountSid: recording?.accountSid,
        lead: leadInfo,
        person: personData,
        location: locationInfo, // Include location data
        call: {
          direction: call?.direction,
          forwardedFrom: call?.forwardedFrom,
          from: call?.from,
          to: call?.to,
          fromFormatted: call?.fromFormatted,
          toFormatted: call?.toFormatted,
          queueTime: call?.queueTime,
        },
      };
    }));
    return new NextResponse(JSON.stringify(recordingsWithCallDetails), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching recordings or call details:', error);
    return new NextResponse(JSON.stringify({ error, message: 'Failed to fetch recordings or call details' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
