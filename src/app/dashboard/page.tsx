"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import SearchBar from "../../components/searchbar/SearchBar";
import { User } from "@supabase/supabase-js";
import Header from "../../components/Header";
import ScrollList from "../../components/ScrollList";
import { OvalRoomMenu } from "../../components/oval-room-menu";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
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
      <main className="p-4 flex-grow flex items-start justify-center overflow-hidden gap-15 mt-4">
        <div className="flex flex-col items-center justify-start gap-10 pt-0">
          <ScrollList title="Math" />
          <ScrollList title="Physics" />
        </div>
      </main>

      {/* Menú de botones en un óvalo centrado */}
      <footer className="relative">
        <OvalRoomMenu />
      </footer>
    </div>
  );
}
