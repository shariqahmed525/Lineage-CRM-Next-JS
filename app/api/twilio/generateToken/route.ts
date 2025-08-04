import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { jwt as twilioJwt } from 'twilio';

import { createSupabaseClient } from '@/utils/supabase/server';

const { AccessToken } = twilioJwt;
const VoiceGrant = AccessToken.VoiceGrant;
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

  const keys = await twilioClient.keys.list({limit: 20})
  console.log('Keys')
  console.log('CJ Cregg',keys)

  const { data: twilioSubaccount, error: twilioSubaccountError } = await supabase
    .from('twilio_subaccounts')
    .select('account_sid, api_key, twiml_application')
    .eq('user_id', user.user.id)
    .single();

  // Create a "grant" which enables a client to use Voice as a given user
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twilioSubaccount?.twiml_application?.sid,
    incomingAllow: true, // Optional: add to allow incoming calls
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET)

  console.log('account sid')
  const token = new AccessToken(
    twilioSubaccount?.account_sid || '',
    twilioSubaccount?.api_key?.sid || '',
    twilioSubaccount?.api_key?.secret || '',
    {identity: user?.user?.id || '', ttl: 3600}
  );

  token.addGrant(voiceGrant);

  // Serialize the token to a JWT string
  const jwt = token.toJwt();
  console.log('Here is the JWT')
  console.log(jwt)

  return new NextResponse(JSON.stringify({ token: jwt }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}