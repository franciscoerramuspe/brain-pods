"use client";
import React, { useEffect, useState } from "react";

const AgoraComponent = () => {
  const [AppWithProvider, setAppWithProvider] = useState<React.FC | null>(null);

  useEffect(() => {
    const loadAgora = async () => {
      const { default: AgoraRTC, AgoraRTCProvider } = await import(
        "agora-rtc-react"
      );
      const App = (await import("./App")).default;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const Component = () => (
        <AgoraRTCProvider client={client}>
          <App />
        </AgoraRTCProvider>
      );

      setAppWithProvider(() => Component);
    };
    loadAgora();
  }, []);

  return AppWithProvider ? <AppWithProvider /> : null;
};

export default AgoraComponent;
