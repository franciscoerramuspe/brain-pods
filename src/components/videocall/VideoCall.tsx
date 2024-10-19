"use client";
import React, { useState, useEffect } from "react";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";

export const Basics: React.FC<{ appId: string }> = ({ appId }) => {
  const [calling, setCalling] = useState<boolean>(false);
  const isConnected = useIsConnected();
  const [channel, setChannel] = useState<string>("");
  const [micOn, setMic] = useState<boolean>(true);
  const [cameraOn, setCamera] = useState<boolean>(true);

  useJoin({ appid: appId || "", channel: channel, token: null }, calling);

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
      width: 1280,
      height: 720,
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

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <div className="user w-60 h-60">
              <LocalUser
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://static.vecteezy.com/system/resources/thumbnails/019/787/070/small_2x/no-photos-and-no-phones-forbidden-sign-on-transparent-background-free-png.png"
              >
                <samp className="user-name">You</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <div className="user w-60 h-60" key={user.uid}>
                <RemoteUser
                  cover="https://static.vecteezy.com/system/resources/thumbnails/019/787/070/small_2x/no-photos-and-no-phones-forbidden-sign-on-transparent-background-free-png.png"
                  user={user}
                >
                  <samp className="user-name">{user.uid}</samp>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
          <div className="join-room">
            <input
              onChange={(e) => {
                setChannel(e.target.value);
                console.log(appId);
              }}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <button
              className={`join-channel ${!channel ? "disabled" : ""}`}
              disabled={!channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control">
          <div className="left-control">
            <button
              className="btn w-10 h-10 bg-blue-600"
              onClick={() => setMic((prev) => !prev)}
            >
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button
              className="btn w-10 h-10 bg-white"
              onClick={() => setCamera((prev) => !prev)}
            >
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone h-10 w-10 bg-red-600 ${
              calling ? "btn-phone-active" : ""
            }`}
            onClick={() => setCalling((prev) => !prev)}
          >
            {calling ? (
              <i className="i-phone-hangup" />
            ) : (
              <i className="i-mdi-phone" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default Basics;
