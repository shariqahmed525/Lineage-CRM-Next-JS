// app/api/twilio/createSubaccount/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { Twilio } from 'twilio';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
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

  // Initialize Twilio client
  const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  try {
    // Create Twilio subaccount
    const friendlyName = `${user?.user?.email}-${user?.user?.id}`;
    const subaccount = await twilioClient.api.accounts.create({ friendlyName });
    console.log('Twilio Subaccount Created", subaccount');
    
    // Save subaccount details to Supabase
    const { data: twilioData, error: twilioError } = await supabase
      .from('twilio_subaccounts')
      .insert({
        user_id: user.user.id,
        account_sid: subaccount.sid,
        auth_token: subaccount.authToken,
        friendly_name: subaccount.friendlyName,
        date_created: subaccount.dateCreated,
        date_updated: subaccount.dateUpdated,
        status: subaccount.status,
        type: subaccount.type,
        uri: subaccount.uri,
        owner_account_sid: subaccount.ownerAccountSid,
        subresource_uris: subaccount.subresourceUris,
      });

    if (twilioError) {
      throw twilioError;
    }

    return new NextResponse(JSON.stringify(twilioData), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating Twilio subaccount:', error);
    return new NextResponse(JSON.stringify({ error, message: 'Failed to create Twilio subaccount.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
