import React from "react";
import { LocalUser, RemoteUser } from "agora-rtc-react";
import Image from "next/image";
import { IAgoraRTCRemoteUser, ICameraVideoTrack } from "agora-rtc-react";
import noCamera from "../../../public/images/noCamera.png";

interface UserGridProps {
  localCameraTrack: ICameraVideoTrack | null;
  cameraOn: boolean;
  micOn: boolean;
  remoteUsers: IAgoraRTCRemoteUser[];
  currentPage: number;
  usersPerPage: number;
}

const UserGrid: React.FC<UserGridProps> = ({
  localCameraTrack,
  cameraOn,
  micOn,
  remoteUsers,
  currentPage,
  usersPerPage,
}) => {
  const allUsers = [
    { uid: "local", cameraOn, micOn, videoTrack: localCameraTrack },
    ...remoteUsers,
  ];
  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  const visibleUsers = allUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const gridClasses =
    visibleUsers.length === 1
      ? "grid-cols-1"
      : visibleUsers.length <= 2
      ? "grid-cols-2"
      : visibleUsers.length <= 4
      ? "grid-cols-2 grid-rows-2"
      : "grid-cols-3 grid-rows-2";

  return (
    <div className={`grid gap-4 max-w-4xl mx-auto h-full ${gridClasses}`}>
      {visibleUsers.map((user, index) => (
        <div
          key={user.uid || index}
          className="relative rounded-lg overflow-hidden w-full"
        >
          {user.uid === "local" && localCameraTrack ? (
            <LocalUser
              cameraOn={cameraOn}
              micOn={micOn}
              videoTrack={localCameraTrack}
              cover={noCamera.src}
              className="w-full h-full"
            />
          ) : user.uid !== "local" ? (
            <RemoteUser
              user={user as IAgoraRTCRemoteUser}
              cover={noCamera.src}
              className="w-full h-full"
            />
          ) : (
            <Image
              src={noCamera}
              alt="You"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
            {user.uid === "local" ? "You" : `User ${user.uid}`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserGrid;
