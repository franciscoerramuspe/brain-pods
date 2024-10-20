import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  console.log('API route called');
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Session in API route:', session);

  if (!session) {
    console.log('No session found in API route');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  console.log('User ID:', session.user.id);

  const { data, error } = await supabase
    .from('user_pod_session')
    .select('*')
    .eq('user_id', session.user.id)
    .order('joined_at', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('Query result:', data);

  return NextResponse.json(data);
}
