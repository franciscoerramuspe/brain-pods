"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { User } from "@supabase/supabase-js";
import { MultiSelect } from "@/components/multi-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../../components/Header";
import ContextProvider from "../../../components/ContextProvider";

export default function NewPod() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Pod Variables
  const [podName, setPodName] = useState<string>("");
  const [podTags, setPodTags] = useState<string[]>([]);
  const [isCreatingPod, setIsCreatingPod] = useState<boolean>(false);

  const tagsList = [
    { value: "react", label: "React" },
    { value: "angular", label: "Angular" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "ember", label: "Ember" },
  ];

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user ?? null);
        } else if (event === "SIGNED_OUT") {
          router.push("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const createPod = async () => {
    if (!user || !podName || podTags.length === 0) return;

    setIsCreatingPod(true);

    try {
      const { data: podData, error: podError } = await supabase.from("pod").insert({
        owner_id: user?.id,
        is_active: true,
        is_premium: false,
        is_public: true,
      })
      .select()
      .single();

    if (podError) throw podError;

    // Insert pod topics
    if (podTags.length > 0) {
      const { error: topicError } = await supabase.from("pod_topic").insert(podTags.map(tag => ({
        pod_id: podData.id,
        topic_name: tag,
      })));

      if (topicError) throw topicError;
    }

    // Redirect to the new pod
    router.push(`/pod/${podData.id}`);
  } catch (error) {
    console.error('Error creating pod: ', error);
  } finally {
    setIsCreatingPod(false);
  }
};

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#323232]">
      <Header user={user} textIsDisplayed={true} userIsDisplayed={true} />

      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl text-gray-200 font-adversecase mb-4">
          New Pod
        </h1>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col p-4 max-w-xl w-full gap-4">
            <Input
              type="text"
              placeholder="Pod Name"
              value={podName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPodName(e.target.value)
              }
            />
            <MultiSelect
              options={tagsList}
              onValueChange={setPodTags}
              defaultValue={podTags}
              placeholder="Select tags"
              animation={0}
              maxCount={3}
            />
          </div>
          <ContextProvider />
        </div>

        <Button className="mt-4" onClick={createPod} disabled={!podName || isCreatingPod}>{isCreatingPod ? "Creating Pod..." : "Create Pod"}</Button>
      </div>
    </div>
  );
}
