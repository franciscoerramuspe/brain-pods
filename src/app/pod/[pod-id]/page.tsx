"use client"; 
import dynamic from "next/dynamic";
// import dotenv from "dotenv";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Snackbar } from "@/components/ui/snackbar";
import { joinPodSession, checkPodStatus, leavePodSession } from "@/lib/podOperations";

const appId = process.env.NEXT_PUBLIC_AGORA_API_KEY;

const Pod = dynamic(
  () => import("../../../components/videocall/AgoraComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    ),
  }
);

const PodPage = () => {
  const router = useRouter();
  const params = useParams();
  const podId = params["pod-id"] as string;
  const [podExists, setPodExists] = useState<boolean | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const leavePod = useCallback(async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await leavePodSession(user.data.user.id, podId);
      }
    } catch (error) {
      console.error('Error leaving pod:', error);
    }
  }, [podId]);

  useEffect(() => {
    const checkAndJoinPod = async () => {
      try {
        const { isActive, hasEnded } = await checkPodStatus(podId);
       
        if (!isActive || hasEnded) {
          setPodExists(false);
          setSnackbarMessage("This pod session has ended or is inactive.");
          setIsSnackbarOpen(true);
          setTimeout(() => router.push('/pod/new'), 1000);
          return;
        }
 
 
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
          throw new Error("User not authenticated");
        }
 
 
        await joinPodSession(user.data.user.id, podId);
        setPodExists(true);
      } catch (error) {
        console.error('Error joining pod:', error);
        setPodExists(false);
        setSnackbarMessage("Error joining pod");
        setIsSnackbarOpen(true);
        setTimeout(() => router.push('/pod/new'), 1000);
      }
    };
 

    checkAndJoinPod();
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      await leavePod();
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        await leavePod();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      leavePod();
    };
  }, [podId, router]);

  if (podExists === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      {podExists ? <Pod appId={appId || ""} /> : null}
      <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      />
    </>
  );
};
export default PodPage;
