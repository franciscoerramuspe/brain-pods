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

        <Button className="mt-4">Create Pod</Button>
      </div>
    </div>
  );
}
