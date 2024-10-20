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
import { TextContext } from "@/interfaces/types";

export default function NewPod() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Pod Variables
  const [podName, setPodName] = useState<string>("");
  const [podTags, setPodTags] = useState<string[]>([]);
  const [isCreatingPod, setIsCreatingPod] = useState<boolean>(false);
  const [contextList, setContextList] = useState<[TextContext | File][]>([]);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);
  const [isCancelHovered, setIsCancelHovered] = useState<boolean>(false);
  const [tagsList, setTagsList] = useState<{ value: string; label: string }[]>(
    []
  ); // State for tags


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

  // Fetch tags from supabase
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from("pod_tag")
          .select("id, tag");

        if (error) throw error;

        const formattedTags = data.map((tag) => ({
          value: tag.tag,
          label: tag.tag
            ? tag.tag
                .toLowerCase()
                .replace(/\b\w/g, (c: string) => c.toUpperCase())
            : "",
        }));
        console.log(data);
        setTagsList(formattedTags);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchTags();
  }, []);

  const createPod = async () => {
    if (!user || !podName || podTags.length === 0) return;

    setIsCreatingPod(true);

    try {
      // Process context
      let finalContext = "";
      for (const item of contextList) {
        if (item[0] instanceof File) {
          const text = await readFileAsText(item[0]);
          finalContext += text + "\n";
        } else {
          finalContext += item[0].text + "\n";
        }
      }
  
      // Create pod
      const { data: podData, error: podError } = await supabase
        .from("pod")
        .insert({
          owner_id: user?.id,
          name: podName,
          is_active: true,
          is_premium: false,
          is_public: true,
        })
        .select()
        .single();
  
      if (podError) throw podError;
  
      // Insert pod topics
      if (podTags.length > 0) {
        const { error: topicError } = await supabase.from("pod_topic").insert(
          podTags.map((tag) => ({
            pod_id: podData.id,
            topic_name: tag.toUpperCase(),
          }))
        );
  
        if (topicError) throw topicError;
      }

      // Hit the API endpoint to upload embeddings
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          podId: podData.id,
          context: finalContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload embeddings');
      }

      // Redirect to the new pod
      router.push(`/pod/${podData.id}`);
    } catch (error) {
      console.error("Error creating pod: ", error);
    } finally {
      setIsCreatingPod(false);
    }
  };

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
     reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file, "UTF-8");
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-[#323232] flex flex-col">
      <Header user={user} textIsDisplayed={true} userIsDisplayed={true} />

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl text-gray-200 font-adversecase mb-8">
          New Pod
        </h1>

        <div className="flex-grow flex flex-col items-center justify-center mt-8">
          <div
            className={`flex flex-col items-center justify-center w-fit rounded-lg p-0 transition-all duration-300  ${
              isButtonHovered
                ? "bg-gradient-to-r from-pink-600 to-purple-600 backdrop-blur-lg p-1"
                : "bg-transparent"
            } ${
              isCancelHovered
                ? "bg-gradient-to-r from-red-600 to-orange-600 backdrop-blur-lg p-1"
                : "bg-transparent"
            }`}
          >
            <div className="bg-[#323232] p-5 rounded-[calc(0.60rem-0.25rem)] border border-[#4A4945]">
              <div className="flex flex-col max-w-xl w-full gap-4 pb-4">
                <Input
                  type="text"
                  placeholder="Pod Name"
                  value={podName}
                  className="dark:bg-[#ffffff] dark:border-[#090908] dark:text-[#090908]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPodName(e.target.value)
                  }
                />
                <MultiSelect
                  options={tagsList} // Now using the state for tagsList
                  onValueChange={setPodTags}
                  defaultValue={podTags}
                  placeholder="Select Tags"
                  animation={0}
                  maxCount={3}
                />
              </div>
              <ContextProvider
                contextList={contextList}
                setContextList={setContextList}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              className="mt-4 mb-0"
              onMouseOver={() => setIsCancelHovered(true)}
              onMouseLeave={() => setIsCancelHovered(false)}
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              className="mt-4"
              onClick={createPod}
            disabled={!podName || isCreatingPod}
              onMouseOver={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
            {isCreatingPod ? "Creating Pod..." : "Create Pod"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
