"use client";
import React, { useEffect, useState } from "react";

const AgoraComponent = ({ appId }: { appId: string }) => {
  const [AppWithProvider, setAppWithProvider] = useState<React.FC | null>(null);

  useEffect(() => {
    const loadAgora = async () => {
      const { default: AgoraRTC, AgoraRTCProvider } = await import(
        "agora-rtc-react"
      );
      const VideoCall = (await import("./VideoCall")).default;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const Component = () => (
        <AgoraRTCProvider client={client}>
          <VideoCall appId={appId} />
        </AgoraRTCProvider>
      );

      setAppWithProvider(() => Component);
    };
    loadAgora();
  }, [appId]);

  return AppWithProvider ? <AppWithProvider /> : null;
};

export default AgoraComponent;
