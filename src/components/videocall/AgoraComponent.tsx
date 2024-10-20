"use client";
import React, { useEffect, useState } from "react";
import { CardMessage, AnswerOption } from "@/interfaces/types";

interface AgoraComponentProps {
  appId: string;
  onAnswerSelected: (question: CardMessage, selectedAnswer: AnswerOption) => void;
}

const AgoraComponent: React.FC<AgoraComponentProps> = ({ appId, onAnswerSelected }) => {
  const [AppWithProvider, setAppWithProvider] = useState<React.FC | null>(null);

  useEffect(() => {
    const loadAgora = async () => {
      const { default: AgoraRTC, AgoraRTCProvider } = await import(
        "agora-rtc-react"
      );
      const Pod = (await import("./Pod")).default;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const Component = () => (
        <AgoraRTCProvider client={client}>
          <Pod appId={appId} onAnswerSelected={onAnswerSelected} />
        </AgoraRTCProvider>
      );

      setAppWithProvider(() => Component);
    };
    loadAgora();
  }, [appId]);

  const handleAnswerClick = (question: CardMessage, answer: AnswerOption) => {
    // ... existing answer handling logic ...

    // Call the onAnswerSelected prop
    onAnswerSelected(question, answer);
  };

  return AppWithProvider ? <AppWithProvider /> : null;
};

export default AgoraComponent;
