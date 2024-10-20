"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Pod {
  id: string;
  name: string;
  is_active: boolean;
  is_public: boolean;
}

interface PodWithTags extends Pod {
  pod_topic: { topic_name: string }[];
}

// List of image paths
const imagePaths = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
];

export default function ScrollList({ title }: { title: string }) {
  const [pods, setPods] = useState<PodWithTags[]>([]);
  const [selectedPod, setSelectedPod] = useState<PodWithTags | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPods = async () => {
      const { data, error } = await supabase
        .from("pod")
        .select("*, pod_topic(topic_name)")
        .eq("is_active", true)
        .eq("is_public", true)
        .limit(10);

      if (error) {
        console.error("Error fetching pods:", error);
      } else if (data) {
        setPods(data);
      }
    };

    fetchPods();
  }, []);

  const handlePodClick = (pod: PodWithTags) => {
    setSelectedPod(pod);
    setIsDialogOpen(true);
  };

  const handleJoinPod = () => {
    if (selectedPod) {
      router.push(`/pod/${selectedPod.id}`);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-left justify-center">
      <h1 className="text-white text-3xl font-bold font-adversecase ml-5">
        {title}
      </h1>
      {/* separator */}
      <div className="w-full h-[1px] bg-[#3B3A36] ml-4 p-px"></div>
      <div className="flex flex-row overflow-x-auto w-screen my-4 px-4 gap-8">
        {pods.map((pod) => (
          <div
            key={pod.id}
            className="relative w-screen h-full min-w-[420px] min-h-[250px] overflow-hidden rounded-lg hover:scale-95 transition-all duration-300 cursor-pointer opacity-80 hover:opacity-100 active:scale-90"
            onClick={() => handlePodClick(pod)}
            style={{
              backgroundImage: `url(${
                imagePaths[Math.floor(Math.random() * imagePaths.length)]
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h1 className="text-4xl font-bold font-adversecase text-white drop-shadow-lg mb-2">
                {pod.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {pod.pod_topic.map((topic, index) => (
                  <span
                    key={index}
                    className="text-sm bg-gray-800 text-white px-2 py-1 rounded-full inline-block"
                  >
                    {topic.topic_name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Pod</DialogTitle>
            <DialogDescription>
              Do you want to join the "{selectedPod?.name}" pod?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinPod}>Join</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
