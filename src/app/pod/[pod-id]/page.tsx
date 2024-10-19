'use client';

import React from 'react';
import Header from '../../../components/Header';
import { MicrophoneIcon, VideoIcon, ChatIcon, PhoneIcon } from '../../../components/Icons';

const participants = [
  { name: 'Brock Davis', image: '/path-to-brock-image.jpg' },
  { name: 'Jada Grimes', image: '/path-to-jada-image.jpg' },
  { name: 'Antwan Cannon', image: '/path-to-antwan-image.jpg' },
  { name: 'Macy Halloway', image: '/path-to-macy-image.jpg' },
];

export default function PodMeeting() {
  return (
    <div className="bg-[#323232] min-h-screen">
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
          <button className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors">
            <ChatIcon className="w-6 h-6 text-white" />
          </button>
          <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
            <PhoneIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
