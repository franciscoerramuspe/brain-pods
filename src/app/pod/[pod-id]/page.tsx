"use client"; 
import dynamic from "next/dynamic";
// import dotenv from "dotenv";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Snackbar } from "@/components/ui/snackbar";

const appId = process.env.NEXT_PUBLIC_AGORA_API_KEY;

const Pod = dynamic(
  () => import("../../../components/videocall/AgoraComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }
);

const PodPage = () => {
  const router = useRouter();
  const params = useParams();
  const podId = params["pod-id"] as string;
  const [podExists, setPodExists] = useState<boolean | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  useEffect(() => {
    const checkPodExists = async () => {
      try {
        const { data, error } = await supabase
          .from('pod')
          .select('is_active')
          .eq('id', podId)
          .single();

        if (error) throw error;
        
        if (data && data.is_active) {
          setPodExists(true);
        } else {
          setPodExists(false);
          setIsSnackbarOpen(true);
          setTimeout(() => router.push('/pod/new'), 1000); // Redirect after 3 seconds
          // router.push('/dashboard'); // or wherever you want to redirect
        }
      } catch (error) {
        console.error('Error checking pod:', error);
        setPodExists(false);
        setIsSnackbarOpen(true);
        setTimeout(() => router.push('/pod/new'), 1000); // Redirect after 3 seconds
        // router.push(' /dashboard'); // or wherever you want to redirect
      }
    };

    checkPodExists();
  }, [podId, router]);

  if (podExists === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      {podExists ? <Pod appId={appId || ""} /> : null}
      <Snackbar
        message="Pod not found or inactive. Redirecting to dashboard..."
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
      />
    </>
  );
};
export default PodPage;
