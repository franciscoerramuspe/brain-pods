"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Chat from "../Chat";
import Header from "../Header";
import {
  MicrophoneIcon,
  VideoIcon,
  ChatIcon,
  PhoneIcon,
  BrainIcon,
  PlayIcon,
} from "../Icons";
import { supabase } from "../../lib/supabase";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import InteractiveCard from "../InteractiveCard";
import { startSession } from "../../app/api/session/route";
import { SocketMessage, CardMessage } from "../../interfaces/types";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";

const participants = [
  { name: "Brock Davis", image: "/path-to-brock-image.jpg" },
  { name: "Jada Grimes", image: "/path-to-jada-image.jpg" },
  { name: "Antwan Cannon", image: "/path-to-antwan-image.jpg" },
  { name: "Macy Halloway", image: "/path-to-macy-image.jpg" },
];

export default function Pod({ podId }: { podId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wsStatus, setWsStatus] = useState<string>("Not connected");
  const [isHovered, setIsHovered] = useState(false);
  const [socketMessage, setSocketMessage] = useState<SocketMessage | null>(
    null
  );
  const [isInteractiveCardOpen, setIsInteractiveCardOpen] = useState(false);

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
        <Header
          user={null}
          textIsDisplayed={false}
          userIsDisplayed={false}
        />
        <InteractiveCard
          message={socketMessage?.data as CardMessage}
          isOpen={isInteractiveCardOpen}
        />
<div className="flex justify-center mt-6 mb-8">
  <Button
    onClick={() => startSession({ podId })}
    disabled={wsStatus === "Disconnected"}
    className="bg-[#46178f] hover:bg-[#5a1cb3] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 group"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <span className="transition-transform duration-300 ease-in-out transform group-hover:-translate-x-2">
      Start Session
    </span>
    <span className="transition-transform duration-300 ease-in-out transform group-hover:-translate-x-2">
      {isHovered ? (
        <BrainIcon className="w-5 h-5" />
      ) : (
        <PlayIcon className="w-5 h-5" />
      )}
    </span>
  </Button>
</div>


        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {participants.map((participant, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden"
              >
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
          <div className="fixed top-6 right-6 bg-[#4A4A4A] text-white p-2 rounded">
            WebSocket Status: {wsStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
