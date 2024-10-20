import React from "react";

const PodList = ({ pods }: any) => {
  return (
    <div className="bg-[#4A4A4A] p-4 mt-2 rounded-lg w-full">
      <h3 className="text-white mb-2">Pods with selected tags:</h3>
      <ul>
        {pods.map((pod: any) => (
          <li key={pod.id} className="text-white">
            {pod.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PodList;
