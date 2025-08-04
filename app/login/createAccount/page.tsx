import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import Content from '.';

const satMigrationCheck = async () => {
  'use server';

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data: authUser } = await supabase.auth.getUser();

  const { data: satUser } = await supabase
    .from('sat_users')
    .select('*')
    .eq('email', authUser?.user?.email!)
    .single();

  return {
    is_from_sat: !!satUser,
  };
};

const CreateAccount = () => {
  return <Content satMigrationCheck={satMigrationCheck} />;
};

export default CreateAccount;
