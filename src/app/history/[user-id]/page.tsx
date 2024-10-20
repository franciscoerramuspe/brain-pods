'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
interface Pod {
  id: string;
  name: string; // Added name field
  owner_id: string;
  is_active: boolean;
  is_premium: boolean;
  is_public: boolean;
  created_at: string;
  ended_at: string | null;
}

interface PodSession {
  id: string;
  pod_id: string;
  user_id: string;
  joined_at: string;
  left_at: string | null;
  is_active: boolean;
  pod: Pod | null;
}

export default function HistoryPage() {
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
      console.log('Fetching pod sessions for user:', currentUser.id);
  
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_pod_session')
        .select(`
          *,
          pod (
            *
          )
        `)
        .eq('user_id', currentUser.id);
  
      if (sessionsError) {
        console.error('Error fetching pod sessions:', sessionsError.message);
        return;
      }
  
      console.log('Fetched sessions with pods:', sessions);
  
      if (sessions && sessions.length > 0) {
        setPodSessions(sessions as PodSession[]);
      } else {
        console.log('No sessions found for user');
        setPodSessions([]);
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
        {podSessions.length > 0 ? (
          <div className="space-y-4">
            {podSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#4A4A4A] rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">
                    {session.pod && session.pod.name ? session.pod.name : 'Unknown Pod'}
                  </h2>
                  <p className="text-sm text-gray-300">
                    Joined at: {formatDate(session.joined_at)}
                  </p>
                  {session.pod && (
                    <p className="text-sm text-gray-300">
                      Pod is {session.pod.is_active ? 'Active' : 'Inactive'}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Duration: {calculateDuration(session.joined_at, session.left_at)}
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
        ) : (
          <p>No pod sessions found.</p>
        )}
      </main>
    </div>
  );
}
