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
  const podId = Array.isArray(params["pod-id"])
    ? params["pod-id"][0]
    : params["pod-id"];

  return <Pod podId={podId} />;
}
