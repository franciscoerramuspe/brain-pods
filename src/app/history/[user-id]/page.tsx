'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';

interface PodSession {
  id: string;
  pod_id: string;
  joined_at: string;
  left_at: string | null;
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [podSessions, setPodSessions] = useState<PodSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log('User data:', data);
      if (data.user) {
        setUser(data.user);
        fetchPodSessions();
      } else {
        console.log('No user found, redirecting to home');
        router.push('/');
      }
    };
    getUser();
  }, [router]);

  const fetchPodSessions = async () => {
    try {
      console.log('Fetching pod sessions...');
      const response = await fetch('/api/pods/history', {
        credentials: 'include',
      });
      console.log('API Response:', response);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Pod Sessions Data:', data);
        setPodSessions(data);
      } else {
        console.error('Failed to fetch pod sessions:', response.status, response.statusText);
        // Attempt to log any error message from the server
        const errorData = await response.text();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching pod sessions:', error);
    }
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
            <HistoryItem key={session.id} session={session} />
          ))}
        </div>
      </main>
    </div>
  );
}

function HistoryItem({ session }: { session: PodSession }) {
  const router = useRouter();

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

  const handleViewPod = () => {
    router.push(`/pod/${session.pod_id}`);
  };

  return (
    <div className="bg-[#4A4A4A] rounded-lg p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Brain Pod Session</h2>
        <p className="text-sm text-gray-300">{formatDate(session.joined_at)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">
          {calculateDuration(session.joined_at, session.left_at)}
        </span>
        <button
          onClick={handleViewPod}
          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}
