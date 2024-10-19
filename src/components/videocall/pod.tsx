"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../Header";
import { useParams, useRouter } from "next/navigation"; // Correct hook for Next.js 13 app directory
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  IAgoraRTCRemoteUser,
} from "agora-rtc-react";
import { MicrophoneIcon, VideoIcon, ChatIcon, PhoneIcon } from "../Icons";

export const Pod: React.FC<{ appId: string }> = ({ appId }) => {
  const router = useRouter();
  const params = useParams();
  const podId = params["pod-id"] as string;

  const [calling, setCalling] = useState<boolean>(false);
  const [micOn, setMic] = useState<boolean>(true);
  const [cameraOn, setCamera] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 6;

  useJoin(
    { appid: appId, channel: podId, token: null },
    calling && !!appId && !!podId
  );

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true, {
    encoderConfig: {
      sampleRate: 48000,
      sampleSize: 16,
      stereo: true,
      bitrate: 64,
    },
  });

  const { localCameraTrack } = useLocalCameraTrack(true, {
    encoderConfig: {
      width: 1920,
      height: 1080,
      bitrateMin: 1000,
      bitrateMax: 1000,
      frameRate: 15,
    },
  });

  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micOn);
    }
  }, [micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(cameraOn);
    }
  }, [cameraOn, localCameraTrack]);

  useEffect(() => {
    if (podId) {
      setCalling(true);
    }
  }, [podId]);

  if (!podId) {
    return <div>Loading...</div>; // or a spinner
  }

  const allUsers = [
    { uid: "local", cameraOn, micOn, videoTrack: localCameraTrack },
    ...remoteUsers,
  ];
  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  const visibleUsers = allUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="bg-[#323232] min-h-screen">
      <Header user={null} textIsDisplayed={false} userIsDisplayed={false} />
      <div className="p-6 h-[77vh]">
        <div
          className={`grid gap-4 max-w-4xl mx-auto h-full ${
            visibleUsers.length === 1
              ? "grid-cols-1"
              : visibleUsers.length <= 2
              ? "grid-cols-2"
              : visibleUsers.length <= 4
              ? "grid-cols-2 grid-rows-2"
              : "grid-cols-3 grid-rows-2"
          }`}
        >
          {visibleUsers.map((user, index) => (
            <div
              key={user.uid || index}
              className="relative rounded-lg overflow-hidden w-full"
            >
              {user.uid === "local" && cameraOn && localCameraTrack ? (
                <LocalUser
                  cameraOn={cameraOn}
                  micOn={micOn}
                  videoTrack={localCameraTrack}
                  cover="https://t4.ftcdn.net/jpg/06/28/36/93/360_F_628369390_99h2NtiLNzHwvQXYlg7JTAX21ID8CSdV.jpg"
                  className="w-full h-full"
                />
              ) : user.uid !== "local" ? (
                <RemoteUser
                  user={user as IAgoraRTCRemoteUser}
                  cover="https://t4.ftcdn.net/jpg/06/28/36/93/360_F_628369390_99h2NtiLNzHwvQXYlg7JTAX21ID8CSdV.jpg"
                  className="w-full h-full"
                />
              ) : (
                <Image
                  src="/images/placeholder.jpg"
                  alt="You"
                  className="w-full h-auto"
                  width={100}
                  height={100}
                />
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                {user.uid === "local" ? "You" : `User ${user.uid}`}
              </div>
            </div>
          ))}
        </div>

        {allUsers.length > usersPerPage && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </>
        )}

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-[#4A4A4A] rounded-full p-2">
          <button
            onClick={() => setMic((prev) => !prev)}
            className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors"
          >
            {micOn ? (
              <MicrophoneIcon className="w-6 h-6 text-white" />
            ) : (
              <MicrophoneIcon className="w-6 h-6 text-red-500" />
            )}
          </button>
          <button
            onClick={() => setCamera((prev) => !prev)}
            className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors"
          >
            {cameraOn ? (
              <VideoIcon className="w-6 h-6 text-white" />
            ) : (
              <VideoIcon className="w-6 h-6 text-red-600" />
            )}
          </button>
          <button className="p-3 rounded-full bg-[#3D3D3D] hover:bg-[#4A4A4A] transition-colors">
            <ChatIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => {
              setCalling(false);
              router.push("/");
            }}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          >
            <PhoneIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pod;
