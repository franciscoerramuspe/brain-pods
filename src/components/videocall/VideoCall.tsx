"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const Basics: React.FC<{ appId: string }> = () => {
  const [podId, setPodId] = useState<string>("");
  const router = useRouter();

  return (
    <>
      <div className="join-room">
        <input
          onChange={(e) => {
            setPodId(e.target.value);
          }}
          placeholder="<Your podId>"
          value={podId}
        />
        <button
          className={`join-podId ${!podId ? "disabled" : ""}`}
          disabled={!podId}
          onClick={() => {
            router.push(`/pod/${podId}`);
          }}
        >
          <span>Join Room</span>
        </button>
      </div>
    </>
  );
};

export default Basics;
