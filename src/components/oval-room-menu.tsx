"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Basics } from "./videocall/VideoCall";
import { useRouter } from "next/navigation"; // Importa el enrutador

export function OvalRoomMenu() {
  const router = useRouter(); // Inicializa el enrutador

  const handleCreateRoom = () => {
    // Redirigir a /pod/new
    router.push("/pod/new");
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white border border-zinc-200 rounded-full shadow-lg px-6 py-3 dark:bg-zinc-950 dark:border-zinc-800">
      {/* Basics component */}
      <div className="flex-grow">
        <Basics />
      </div>

      {/* Divider line */}
      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Create Room Button */}
      <Button
        className="h-10 w-10 flex items-center justify-center p-0 rounded-full bg-black hover:scale-105 transition-transform duration-300"
        variant="ghost"
        onClick={handleCreateRoom}
      >
        <PlusCircle className="h-6 w-6 text-white" />
        <span className="sr-only">Create Room</span>
      </Button>
    </div>
  );
}
