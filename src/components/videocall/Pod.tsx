"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Chat from '../Chat';
import Header from "../Header";
import {
s  LocalUser,
  RemoteUser,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  IAgoraRTCRemoteUser,
} from "agora-rtc-react";
import { MicrophoneIcon, VideoIcon, ChatIcon, PhoneIcon, BrainIcon, PlayIcon } from "../Icons";
import { createClient, User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { supabase } from "../../lib/supabase";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import Chat from "../Chat";
import { User } from "@supabase/supabase-js";
import InteractiveCard from "./InteractiveCard";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Pod({ podId }: { podId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wsStatus, setWsStatus] = useState<string>("Not connected");
  const [isHovered, setIsHovered] = useState(false);
  const [socketMessage, setSocketMessage] = useState<SocketMessage | null>(null);
  const [isInteractiveCardOpen, setIsInteractiveCardOpen] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push("/");
      }
    };

    getUser();

    let ws: WebSocket;

    const connectWebSocket = () => {
      ws = new WebSocket(
        `wss://brain-pods-cloud-508208716471.us-central1.run.app/?podId=${podId}`
        // `http://localhost:8081/?podId=${podId}`
      );

      ws.onopen = () => {
        setWsStatus("Connected");
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        console.log("Received:", event.data);
        const message: SocketMessage = JSON.parse(event.data);
        if (message.type === "open") {
          setSocketMessage(message);
          setIsInteractiveCardOpen(true);
        } else if (message.type === "close") {
          setIsInteractiveCardOpen(false);
        } else if (message.type === "chat") {
          setSocketMessage(message);
        }
      };

      ws.onerror = (error) => {
        setWsStatus("Error connecting");
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        setWsStatus("Disconnected");
        console.log("WebSocket disconnected");
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [podId, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#323232] min-h-screen flex">
      <div className="flex-grow">
        <Header user={null} textIsDisplayed={false} userIsDisplayed={false} />
        <InteractiveCard
          message={socketMessage?.data as CardMessage}
          isOpen={isInteractiveCardOpen}
        />
        <div className="flex justify-center mt-6 mb-8">
          <Button
            onClick={() => startSession({ podId })}
            disabled={wsStatus === "Disconnected"}
            className="bg-[#46178f] hover:bg-[#5a1cb3] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 ease-in-out flex items-center justify-center overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center space-x-2 transition-transform duration-300 ease-in-out group-hover:scale-110 origin-center">
              <span className="text-base">Start Session</span>
              <span>
                {isHovered ? (
                  <BrainIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
              </span>
            </div>
          </Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {participants.map((participant, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img
                  src={participant.image}
                  alt={participant.name}
                  className="w-full h-auto"
                />
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
                <SheetPrimitive.Title className="sr-only">
                  Chat
                </SheetPrimitive.Title>
                <Chat podId={podId} user={user} />
              </SheetContent>
            </Sheet>

            <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
              <PhoneIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* WebSocket status display */}
          <div className="fixed top-6 right-6 bg-[#4A4A4A] text-white p-2 rounded">
            WebSocket Status: {wsStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
