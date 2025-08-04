import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);

  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return new NextResponse(JSON.stringify({ error: 'File path is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

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

  // Generate signed URL without the ?download parameter
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('attachments').createSignedUrl(filePath, 3600);

  if (signedUrlError) {
    console.error('Error generating signed URL:', signedUrlError);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate signed URL.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  console.log('Signed URL:', signedUrlData);
  // Manually construct the URL to exclude the ?download parameter
  const signedUrl = signedUrlData?.signedUrl?.replace('?download', '');

  return new NextResponse(JSON.stringify({ signedUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
