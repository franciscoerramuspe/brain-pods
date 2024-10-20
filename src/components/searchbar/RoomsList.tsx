import React from "react";

const RoomsList = ({ rooms }: any) => {
  return (
    <div className="bg-[#4A4A4A] p-4 mt-4 rounded-lg w-full">
      <h3 className="text-white mb-2">Rooms with selected tags:</h3>
      <ul>
        {rooms.map((room: any) => (
          <li key={room.id} className="text-white">
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsList;
