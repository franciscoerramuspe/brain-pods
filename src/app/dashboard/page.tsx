'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/Logo';
import SearchBar from '../../components/SearchBar';
import UserInfo from '../../components/UserInfo';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        router.push('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#323232]">
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <Logo className="w-12 h-12 mr-4" />
          <h1 className="text-4xl font-bold text-white font-adversecase">Brain Pods</h1>
        </div>
        <UserInfo user={user} />
      </header>
      <main className="p-4">
        <SearchBar />
      </main>
    </div>
  );
}
