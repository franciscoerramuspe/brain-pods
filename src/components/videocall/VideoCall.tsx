"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const Basics: React.FC = () => {
  const [podId, setPodId] = useState<string>("");
  const router = useRouter();

  return (
    <div className="join-room flex flex-col gap-4 bg-gray-800 p-4 rounded-md h-full w-full ">
      <input
        onChange={(e) => {
          setPodId(e.target.value);
        }}
        placeholder="Enter your code"
        value={podId}
        className="w-full p-2 rounded-md bg-gray-800 text-white"
        onKeyDown={(e) => {
          if (e.key === "Enter" && podId) {
            router.push(`/pod/${podId}`);
          }
        }}
      />
      <button
        className={`join-podId px-4 py-2 rounded-md hover:cursor-pointer bg-gray-800 text-white ${
          !podId ? "disabled" : ""
        }`}
        disabled={!podId}
        onClick={() => {
          router.push(`/pod/${podId}`);
        }}
      >
        <span>Join</span>
      </button>
    </div>
  );
};

export default Basics;
