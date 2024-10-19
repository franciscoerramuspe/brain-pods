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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white border border-zinc-200 rounded-full shadow-lg px-4 py-2 dark:bg-zinc-950 dark:border-zinc-800">
      <Basics />

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

      <Button
        className="h-8 w-8 p-0"
        variant="ghost"
        onClick={handleCreateRoom}
      >
        <PlusCircle className="h-5 w-5" />
        <span className="sr-only">Create Room</span>
      </Button>
    </div>
  );
}
