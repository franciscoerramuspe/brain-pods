import React, { useState, useRef, useEffect } from "react";
import { LightningIcon, TagIcon, StarIcon, LetterIcon } from "./Icons";
import { motion } from "framer-motion";

const SearchBar: React.FC = () => {
  const options = [
    {
      value: "Search By Pod Name",
      label: "Pod Name",
      icon: <LetterIcon className="w-6 h-6 mr-2 " stroke="white" />, // Icon gets hover class
    },
    {
      value: "Search By Tag",
      label: "Tags",
      icon: <TagIcon className="w-6 h-6 mr-2 " stroke="white" />, // Icon gets hover class
    },
    {
      value: "Ask AI",
      label: "Ask AI",
      icon: <StarIcon className="w-6 h-6 mr-2 " stroke="white" />, // Icon gets hover class
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex items-stretch bg-[#4A4A4A] rounded-2xl w-full max-w-2xl mx-auto relative h-14 transition-all duration-300 p-1 ${
        isDropdownOpen
          ? "ring-[1px] ring-pink-600 bg-gradient-to-r from-pink-600 to-purple-600 backdrop-blur-lg"
          : "bg-transparent"
      } focus-within:ring-[1px] focus-within:ring-pink-600 focus-within:bg-gradient-to-r focus-within:from-pink-600 focus-within:to-purple-600 focus-within:backdrop-blur-lg`}
    >
      <div ref={dropdownRef} className="relative">
        <button
          className="bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-300 rounded-l-2xl h-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedOption.icon}
        </button>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-full left-0 mt-2 bg-[#3D3D3D] rounded-lg shadow-lg z-50 w-48"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full flex items-center px-4 py-3 text-sm text-white hover:bg-[#4A4A4A] transition-all duration-300 rounded-lg"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setSelectedOption(option);
                }}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
      <input
        type="text"
        placeholder="What do you want to brain at?"
        className="bg-[#323232] text-white placeholder-gray-400 flex-grow outline-none px-4 py-3 text-lg "
      />
      <button className="bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-300 rounded-r-2xl">
        <LightningIcon className="w-8 h-8" stroke="white" />
      </button>
    </div>
  );
};

export default SearchBar;
