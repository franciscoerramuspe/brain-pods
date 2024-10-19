import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function getUserNameById(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user name:', error);
    return null;
  }

  return data?.name || null;
}
