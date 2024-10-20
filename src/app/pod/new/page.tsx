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
import uploadEmbeddings from "@/app/api/files/route";
import { TextContext } from "@/interfaces/types";

export default function NewPod() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Pod Variables
  const [podName, setPodName] = useState<string>("");
  const [podTags, setPodTags] = useState<string[]>([]);
  const [contextList, setContextList] = useState<[TextContext | File][]>([]);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);

  const tagsList = [
    { value: "react", label: "React" },
    { value: "angular", label: "Angular" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "ember", label: "Ember" },
  ];

  const handleCreatePod = async () => {
    // INSERT POD INTO DATABASE, GET POD ID

    let finalContext = "";

    contextList.forEach(async (item) => {
      if (item[0] instanceof File) {
        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
          const textFromFileLoaded = fileLoadedEvent.target?.result;
          finalContext += textFromFileLoaded;
          finalContext += "\n";
        };
        fileReader.readAsText(item[0], "UTF-8");
      } else {
        finalContext += item[0].text;
        finalContext += "\n";
      }
    });

    // uploadEmbeddings({ podId: podName, context: finalContext });
  };

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
                  options={tagsList}
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
          <Button
            className="mt-4 mb-0"
            onMouseOver={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={handleCreatePod}
          >
            Create Pod
          </Button>
        </div>
      </div>
    </div>
  );
}
