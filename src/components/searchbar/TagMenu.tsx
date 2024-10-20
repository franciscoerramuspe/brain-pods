import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TagMenuProps } from "./types";

const TagMenu: React.FC<TagMenuProps> = ({
  tags,
  selectedTags,
  setSelectedTags,
  pods,
  menuRef,
}) => {
  const router = useRouter();

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 mt-2 bg-[#3D3D3D] rounded-lg shadow-lg w-full z-10 max-h-[60vh] overflow-y-auto"
    >
      <div className="flex space-x-2 overflow-x-auto mb-4 p-4">
        {tags.map((tag: string) => (
          <button
            key={tag}
            onClick={() => handleTagSelect(tag)}
            className={`px-4 py-2 rounded-full transition-colors border ${
              selectedTags.includes(tag)
                ? "bg-[#DB64B7] text-white border-pink-400"
                : "bg-[#3D3D3D] text-gray-300 border-gray-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {pods.length > 0 && (
        <div className="mt-2 p-2">
          <ul>
            {pods.map((pod) => (
              <li
                key={pod.id}
                className="text-white bg-zinc-700 rounded-lg p-3 shadow-lg flex flex-col justify-between mb-2"
              >
                <div className="flex flex-row justify-between">
                  <div>
                    <p className="text-lg">{pod.name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pod.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/pod/${pod.id}`)}
                    className="bg-white text-black font-semibold px-8 py-2 rounded-lg mt-4 self-start"
                  >
                    Join Pod
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default TagMenu;
