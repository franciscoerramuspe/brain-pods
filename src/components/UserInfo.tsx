import React, { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { supabase } from "../lib/supabase";
import { LogoutIcon } from "./Icons";
import { useRouter } from "next/navigation";

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getFirstName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const firstName = getFirstName();
  const avatarUrl = user.user_metadata?.avatar_url;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navigateToHistory = () => {
    router.push(`/history/${user.id}`);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="flex items-center bg-[#D9D9D9] rounded-lg p-2 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="text-black font-semibold mr-2">{firstName}</span>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={firstName}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            {firstName[0].toUpperCase()}
          </div>
        )}
      </div>
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 bg-[#D9D9D9] rounded-lg shadow-lg z-50 w-full min-w-[120px]">
          <button
            className="w-full flex items-center px-4 py-3 text-sm text-black hover:bg-[#C0C0C0] transition-colors duration-200 rounded-lg"
            onClick={navigateToHistory}
          ><span>View History</span></button>
          <button
            className="w-full flex items-center px-4 py-3 text-sm text-black hover:bg-[#C0C0C0] transition-colors duration-200 rounded-lg"
            onClick={handleLogout}
          >
            <LogoutIcon className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
