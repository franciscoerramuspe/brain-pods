"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import GoogleButton from "../components/GoogleButton";
import Logo from "../components/Logo";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <Logo className="w-20 h-20 mb-4" />
        <h1 className="text-6xl font-bold text-white font-adversecase">
          Brain Pods
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <GoogleButton className="px-4 py-2 text-base w-64" />
      </div>
    </div>
  );
}
