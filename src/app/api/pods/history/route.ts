import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Session in API route:', session); // Add this line

  if (!session) {
    console.log('No session found in API route'); // Add this line
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_pod_session')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .order('joined_at', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error); // Add this line
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
