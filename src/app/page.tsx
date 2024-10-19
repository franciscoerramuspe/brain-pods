"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import GoogleButton from "../components/GoogleButton";
import Logo from "../components/Logo";
import { Basics } from "../components/videocall/VideoCall";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          router.push("/dashboard");
        }
      }
    );

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
        <button
          className="px-4 py-2 text-sm text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-200 w-48"
          onClick={() => setIsModalOpen(true)}
        >
          Have a code?
        </button>
      </div>
      {isModalOpen ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)} // Cierra el modal al hacer clic afuera
        >
          <div
            className="rounded-md"
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el overlay
          >
            <Basics />
          </div>
        </div>
      ) : null}
    </div>
  );
}
