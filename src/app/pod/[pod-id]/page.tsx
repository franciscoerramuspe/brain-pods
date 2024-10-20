"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Pod = dynamic(() => import("../../../components/videocall/Pod"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  ),
});

export default function PodPage() {
  const params = useParams();
  const podId = params["pod-id"] as string;
  const [podExists, setPodExists] = useState<boolean | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let userSession: string | null = null;

    const checkAndJoinPod = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }
        setUserId(user.id);
        userSession = user.id;

        // const { isActive, hasEnded } = await checkPodStatus(podId);
        
        // if (!isActive || hasEnded) {
        //   setPodExists(false);
        //   setSnackbarMessage("This pod session has ended or is inactive.");
        //   setIsSnackbarOpen(true);
        //   setTimeout(() => router.push('/pod/new'), 1000);
        //   return;
        // }

        await joinPodSession(user.id, podId);
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

    return () => {
      if (userSession && podId) {
        leavePodSession(userSession, podId)
          .then((result) => {
            if (result) {
              console.log("Left pod session successfully");
              return updatePodStatus(podId);
            } else {
              console.log("Failed to leave pod session or session was already closed");
              return updatePodStatus(podId);
            }
          })
          .then(updatedPod => {
            if (updatedPod) {
              console.log("Pod status updated: ", updatedPod);
            } else {
              console.log("Pod status not updated, there might still be active users");
            }
          })
          .catch(error => console.error('Error leaving pod:', error));
      }
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
  const podId = Array.isArray(params["pod-id"])
    ? params["pod-id"][0]
    : params["pod-id"];

  return <Pod podId={podId} />;
}
