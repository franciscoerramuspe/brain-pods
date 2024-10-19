"use client";
import dynamic from "next/dynamic";

const AgoraComponent = dynamic(() => import("../components/AgoraComponent"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const HomePage = () => <AgoraComponent />;

export default HomePage;
