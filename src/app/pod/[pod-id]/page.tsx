'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chat from '../../../components/Chat';
import Header from '../../../components/Header';
import {
  MicrophoneIcon,
  VideoIcon,
  ChatIcon,
  PhoneIcon,
} from '../../../components/Icons';
import { supabase } from '../../../lib/supabase';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { User } from '@supabase/supabase-js';

const participants = [
  { name: 'Brock Davis', image: '/path-to-brock-image.jpg' },
  { name: 'Jada Grimes', image: '/path-to-jada-image.jpg' },
  { name: 'Antwan Cannon', image: '/path-to-antwan-image.jpg' },
  { name: 'Macy Halloway', image: '/path-to-macy-image.jpg' },
];

export default function PodMeeting() {
  const router = useRouter();
  const params = useParams();
  const podId = Array.isArray(params['pod-id']) ? params['pod-id'][0] : params['pod-id'];
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/');
      }
    };
    getUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#323232] min-h-screen flex">
      <div className="flex-grow">
        <Header user={null} textIsDisplayed={false} userIsDisplayed={false} />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {participants.map((participant, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img src={participant.image} alt={participant.name} className="w-full h-auto" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  {participant.name}
                </div>
                {index === 2 && (
                  <div className="absolute top-2 left-2 bg-green-500 w-1 h-full" />
                )}
              </div>
            ))}
          </div>
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-[#4A4A4A] rounded-full p-2">
            <button className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors">
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </button>
            <button className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors">
              <VideoIcon className="w-6 h-6 text-white" />
            </button>

            <Sheet>
              <SheetTrigger asChild>
                <button className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors">
                  <ChatIcon className="w-6 h-6 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] p-0">
                <SheetPrimitive.Title className="sr-only">Chat</SheetPrimitive.Title>
                <Chat podId={podId || ''} user={user} />
              </SheetContent>
            </Sheet>

            <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
              <PhoneIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
