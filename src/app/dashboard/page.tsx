"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import SearchBar from "../../components/SearchBar";
import { User } from "@supabase/supabase-js";
import Header from "../../components/Header";
import { Basics } from "../../components/videocall/VideoCall";
import { OvalRoomMenu } from "../../components/oval-room-menu";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen bg-[#323232] flex flex-col">
      {/* Header */}
      <Header user={user} textIsDisplayed={true} userIsDisplayed={true} />

      {/* SearchBar justo debajo del header */}
      <div className="p-4">
        <SearchBar />
      </div>

      {/* Contenido principal (puede crecer según el espacio disponible) */}
      <main className="p-4 flex-grow flex items-center justify-center"></main>

      {/* Menú de botones en un óvalo centrado */}
      <footer className="relative">
        <OvalRoomMenu />
      </footer>
      {isModalOpen ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
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
