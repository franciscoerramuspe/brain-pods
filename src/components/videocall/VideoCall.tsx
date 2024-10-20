"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Snackbar } from "@/components/ui/snackbar";

export const Basics: React.FC = () => {
  const [podId, setPodId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleJoinPod = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("pod")
        .select("is_active")
        .eq("id", podId)
        .single();

      if (error) throw error;

      if (data && data.is_active) {
        router.push(`/pod/${podId}`);
      } else {
        setIsSnackbarOpen(true);
        setTimeout(() => setIsSnackbarOpen(false), 3000);
      }
    } catch (error) {
      console.error("Error joining pod: ", error);
      setIsSnackbarOpen(true);
      setTimeout(() => setIsSnackbarOpen(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-none rounded-full shadow-lg px-4 py-3 flex items-center space-x-3 dark:bg-zinc-950 dark:border-zinc-800 transition-all duration-300 ease-in-out transform ">
      <input
        onChange={(e) => {
          setPodId(e.target.value);
          setIsSnackbarOpen(false);
        }}
        placeholder="Enter your code"
        className="w-60 h-10 text-sm bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4"
        value={podId}
      />
      <button
        className={`px-6 py-2 rounded-md bg-gradient-to-r bg-white text-black font-semibold shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out ${
          !podId || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!podId || isLoading}
        onClick={handleJoinPod}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <span>Join Pod</span>
        )}
      </button>
      <Snackbar
        message="Pod not found or inactive."
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      />
    </div>
  );
};

export default Basics;
