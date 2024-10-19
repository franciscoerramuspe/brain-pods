'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import SearchBar from '../../components/SearchBar';
import { User } from '@supabase/supabase-js';
import Header from '../../components/Header';

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

  const navigateToHistory = () => {
    router.push(`/history/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-[#323232]">
      <Header user={user} textIsDisplayed={true} userIsDisplayed={true} />
      <main className="p-4">
        <SearchBar />
        <div className="mt-6 flex justify-center">
          <button
            onClick={navigateToHistory}
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            View History
          </button>
        </div>
      </main>
    </div>
  );
}
