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
import React, { useState } from "react";

export const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");

  useJoin({ appid: appId, channel: channel, token: null }, calling);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn, {
    encoderConfig: {
      sampleRate: 48000,
      sampleSize: 16,
      stereo: true,
      bitrate: 64,
    },
  });

  const { localCameraTrack } = useLocalCameraTrack(cameraOn, {
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

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <div className="user w-60 h-60">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://cdn-icons-png.flaticon.com/512/1082/1082810.png"
              >
                <samp className="user-name">You</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <div className="user w-60 h-60" key={user.uid}>
                <RemoteUser
                  cover="https://cdn-icons-png.flaticon.com/512/1082/1082810.png"
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
              onChange={(e) => setAppId(e.target.value)}
              placeholder="<Your app ID>"
              value={appId}
            />
            <input
              onChange={(e) => setChannel(e.target.value)}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <input
              onChange={(e) => setToken(e.target.value)}
              placeholder="<Your token>"
              value={token}
            />

            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
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
              onClick={() => setMic((a) => !a)}
            >
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button
              className="btn w-10 h-10 bg-white"
              onClick={() => setCamera((a) => !a)}
            >
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone h-10 w-10 bg-red-600 ${
              calling ? "btn-phone-active" : ""
            }`}
            onClick={() => setCalling((a) => !a)}
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
