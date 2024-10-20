import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const TagMenu = ({ tags, selectedTags, setSelectedTags, pods }: any) => {
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 mt-2 bg-[#3D3D3D] rounded-lg shadow-lg w-full z-10" // Aseguramos que ocupe el ancho completo
    >
      {/* Scroll horizontal para los tags */}
      <div className="flex space-x-2 overflow-x-auto mb-4 p-2">
        {tags.map((tag: string) => (
          <button
            key={tag}
            onClick={() => handleTagSelect(tag)}
            className={`px-4 py-2 rounded-full transition-colors border ${
              selectedTags.includes(tag)
                ? "bg-pink-600 text-white border-pink-400"
                : "bg-[#3D3D3D] text-gray-300 border-gray-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Lista vertical de pods filtrados debajo del scroll de tags */}
      {pods.length > 0 && (
        <div className="mt-2 p-2">
          <h3 className="text-white mb-2">Pods with selected tags:</h3>
          <ul>
            {pods.map((pod: any) => (
              <li key={pod.id} className="text-white">
                <button
                  onClick={() => router.push(`/pod/${pod.id}`)}
                  className="hover:underline text-left w-full"
                >
                  {pod.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default TagMenu;
