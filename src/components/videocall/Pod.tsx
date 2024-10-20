"use client";

import React, { useState, useEffect } from "react";
import Header from "../Header";
import { useParams, useRouter } from "next/navigation";
import {
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { createClient, User } from "@supabase/supabase-js";
import InteractiveCard from "@/components/InteractiveCard";
import { SocketMessage, CardMessage } from "@/interfaces/types";
import { Button } from "@/components/ui/button";
import { PlayIcon, BrainIcon } from "lucide-react";
import Controls from "./Controls";
import UserGrid from "./UserGrid";
import UserTracker from "@/components/UserTracker";
import { startSession } from "@/app/api/session/route";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Pod: React.FC<{ appId: string }> = ({ appId }) => {
  const router = useRouter();
  const params = useParams();
  const podId = params["pod-id"] as string;

  const [calling, setCalling] = useState(false);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [wsStatus, setWsStatus] = useState("Not connected");
  const [socketMessage, setSocketMessage] = useState<SocketMessage | null>(
    null
  );
  const [isInteractiveCardOpen, setIsInteractiveCardOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const usersPerPage = 6;

  // Agora RTC Hooks
  useJoin(
    { appid: appId, channel: podId, token: null },
    calling && !!appId && !!podId
  );

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn, {
    encoderConfig: {
      sampleRate: 48000,
      sampleSize: 16,
      stereo: true,
      bitrate: 64,
    },
  });

  const { localCameraTrack } = useLocalCameraTrack(cameraOn, {
    encoderConfig: {
      width: 1920,
      height: 1080,
      bitrateMin: 1000,
      bitrateMax: 1000,
      frameRate: 15,
    },
  });

  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();

  // Calculate total users
  const totalUsers = remoteUsers.length + 1; // +1 for the local user

  // Fetch the authenticated user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
      else router.push("/");
    };
    getUser();
  }, [router]);

  // Enable calling when podId is available
  useEffect(() => {
    if (podId) setCalling(true);
  }, [podId]);

  // WebSocket connection for interactive card and session status
  useEffect(() => {
    const ws = new WebSocket(
      `wss://brain-pods-cloud-508208716471.us-central1.run.app/?podId=${podId}`
    );

    ws.onopen = () => {
      setWsStatus("Connected");
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const message: SocketMessage = JSON.parse(event.data);
      console.log("Received:", message);
      handleSocketMessage(message);
    };

    ws.onerror = (error) => {
      setWsStatus("Error connecting");
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setWsStatus("Disconnected");
      console.log("WebSocket disconnected");
    };

    return () => ws.close();
  }, [podId]);

  const handleSocketMessage = (message: SocketMessage) => {
    if (message.type === "open") {
      setSocketMessage(message);
      setIsInteractiveCardOpen(true);
    } else if (message.type === "close") {
      setIsInteractiveCardOpen(false);
    } else if (message.type === "chat") {
      setSocketMessage(message);
    }
  };

  // Handle toggling microphone and camera
  const toggleMic = () => {
    setMic((prev) => !prev);
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!micOn);
    }
  };

  const toggleCamera = () => {
    setCamera((prev) => !prev);
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!cameraOn);
    }
  };

  const handleStartSession = async () => {
    try {
      if (!podId) {
        console.error("Pod ID is not available");
        return;
      }
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ podId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Session started successfully:", result);
      // Handle successful session start (e.g., update UI, show a message)
    } catch (error) {
      console.error("Error starting session:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  // Render the loading screen if no podId or user is present
  if (!podId || !user) return <div>Loading...</div>;

  return (
    <div className="bg-[#323232] min-h-screen">
      <Header user={null} textIsDisplayed={false} userIsDisplayed={false} />

      {/* Render the InteractiveCard component */}
      <InteractiveCard
        message={socketMessage?.data as CardMessage}
        isOpen={isInteractiveCardOpen}
      />

      {/* Start Session Button */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={handleStartSession}
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

      {/* User Grid */}
      <div className="p-6 h-[77vh]">
        <UserGrid
          localCameraTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          remoteUsers={remoteUsers}
          currentPage={currentPage}
          usersPerPage={usersPerPage}
        />
      </div>

      {/* Controls */}
      <Controls
        micOn={micOn}
        cameraOn={cameraOn}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        podId={podId}
        user={user}
        setCalling={setCalling}
      />

      {/* User Tracker */}
      <UserTracker podId={podId} userCount={totalUsers} />
    </div>
  );
};

export default Pod;
