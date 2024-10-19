"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Basics: React.FC = () => {
  const [podId, setPodId] = useState<string>("");
  const router = useRouter();

  const handleJoin = () => {
    if (podId.trim()) {
      router.push(`/pod/${podId}`);
    }
  };

  return (
    <div className="bg-white border-none  rounded-full shadow-lg px-4 py-2 flex items-center space-x-2 dark:bg-zinc-950 dark:border-zinc-800">
      <Input
        className="w-32 h-8 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setPodId(e.target.value)}
        placeholder="Enter your code"
        value={podId}
      />
      <Button
        className="h-8 px-3 text-sm"
        onClick={handleJoin}
        disabled={!podId.trim()} // Disable button when no podId
      >
        Join
      </Button>
    </div>
  );
};

export default Basics;
