import React from "react";
import { useRouter } from "next/navigation";
import { MicrophoneIcon, VideoIcon, ChatIcon, PhoneIcon } from "../Icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import Chat from "../Chat";
import { User } from "@supabase/supabase-js";

interface ControlsProps {
  micOn: boolean;
  cameraOn: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;
  podId: string;
  user: User;
  setCalling: (value: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  micOn,
  cameraOn,
  toggleMic,
  toggleCamera,
  podId,
  user,
  setCalling,
}) => {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-[#4A4A4A] rounded-full p-2 z-50">
      <button
        onClick={toggleMic}
        className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors"
      >
        {micOn ? (
          <MicrophoneIcon className="w-6 h-6 text-white" />
        ) : (
          <MicrophoneIcon className="w-6 h-6 text-red-500" />
        )}
      </button>

      <button
        onClick={toggleCamera}
        className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors"
      >
        {cameraOn ? (
          <VideoIcon className="w-6 h-6 text-white" />
        ) : (
          <VideoIcon className="w-6 h-6 text-red-600" />
        )}
      </button>

      <Sheet>
        <SheetTrigger asChild>
          <button className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors">
            <ChatIcon className="w-6 h-6 text-white" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] p-0">
          <SheetPrimitive.Title className="sr-only">Chat</SheetPrimitive.Title>
          <Chat podId={podId} user={user} />
        </SheetContent>
      </Sheet>

      <button
        onClick={() => {
          setCalling(false);
          router.push("/");
        }}
        className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <PhoneIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Controls;
