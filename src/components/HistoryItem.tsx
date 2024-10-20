'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface PodSession {
    id: string;
    pod_id: string;
    joined_at: string;
    left_at: string | null;
    pods: {
      id: string;
      title: string;
      description: string;
      created_at: string;
    };
  }
  

export default function HistoryItem({ session }: { session: PodSession }) {
  const [user, setUser] = useState<User | null>(null);
  const [podSessions, setPodSessions] = useState<PodSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        fetchPodSessions(data.user);
      } else {
        router.push('/');
      }
    };
    getUser();
  }, [router]);

  const fetchPodSessions = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('user_pod_session')
        .select(
          `
          *,
          pod (
            id,
            name,
            description,
            created_at
          )
          `
        )
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error fetching pod sessions:', error.message);
      } else {
        console.log('Pod Sessions Data:', data);
        setPodSessions(data as PodSession[]);
      }
    } catch (error) {
      console.error('Error fetching pod sessions:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const durationMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleViewPod = (podId: string) => {
    router.push(`/pod/${podId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#323232] text-white">
      <Header user={user} textIsDisplayed={true} userIsDisplayed={true} />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">History</h1>
        <div className="space-y-4">
          {podSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#4A4A4A] rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{session.pods.title}</h2>
                <p className="text-sm text-gray-300">{formatDate(session.joined_at)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {calculateDuration(session.joined_at, session.left_at)}
                </span>
                <button
                  onClick={() => handleViewPod(session.pod_id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
