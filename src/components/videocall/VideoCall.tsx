"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const Basics: React.FC = () => {
  const [podId, setPodId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (podId.trim()) {
      setIsLoading(true);
      const isValid = await validatePodId(podId);
      setIsLoading(false);

      if (isValid) {
        router.push(`/pod/${podId}`);
      } else {
        alert("Invalid pod ID. Please check and try again.");
      }
    }
  };

  const validatePodId = async (podId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("pod")
        .select("id")
        .eq("id", podId)
        .eq("is_active", true)
        .eq("is_public", true)
        .single();

      if (error || !data) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error fetching pod:", error);
      return false;
    }
  };

  return (
    <div className="bg-white border-none rounded-full shadow-lg px-4 py-2 flex items-center space-x-2 dark:bg-zinc-950 dark:border-zinc-800">
      <Input
        className="w-32 h-8 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setPodId(e.target.value)}
        placeholder="Enter your code"
        value={podId}
      />
      <Button
        className="h-8 px-3 text-sm"
        onClick={handleJoin}
        disabled={!podId.trim() || isLoading} // Disable button during loading or when no podId
      >
        {isLoading ? "Joining..." : "Join"}
      </Button>
    </div>
  );
};

export default Basics;
