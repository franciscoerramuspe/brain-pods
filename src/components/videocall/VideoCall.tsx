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

    try{
      const { data, error } = await supabase
        .from('pod')
        .select('is_active')
        .eq('id', podId)
        .single();

      if (error) throw error;

      if (data && data.is_active) {
        router.push(`/pod/${podId}`);
      } else {
        setIsSnackbarOpen(true);
        setTimeout(() => setIsSnackbarOpen(false), 1000);
      }
    } catch (error) {
      console.error('Error joining pod: ', error);
      setIsSnackbarOpen(true);
      setTimeout(() => setIsSnackbarOpen(false), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-room flex flex-col gap-4 bg-gray-800 p-4 rounded-md h-full w-full ">
      <input
        onChange={(e) => {
          setPodId(e.target.value);
          setIsSnackbarOpen(false);
        }}
        placeholder="Enter your code"
        value={podId}
        className="w-full p-2 rounded-md bg-gray-800 text-white"
      />
      <button
        className={`join-podId px-4 py-2 rounded-md bg-gray-800 text-white ${
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
          <span>Join Room</span>
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
