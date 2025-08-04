import { Twilio } from 'twilio';

export const getTwilioClientForUser = async (supabase: any) => {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Failed to get user');
  }

  const { data: twilioData, error: twilioError } = await supabase
    .from('twilio_subaccounts')
    .select('account_sid, auth_token')
    .eq('user_id', user.user.id)
    .single();

  if (twilioError || !twilioData) {
    throw new Error('Failed to get Twilio subaccount');
  }

  const twilioClient = new Twilio(twilioData.account_sid, twilioData.auth_token);

  return twilioClient;
};
