import React from "react";
import { motion } from "framer-motion";
import { LetterIcon, TagIcon, StarIcon } from "../Icons";

const options = [
  {
    value: "Search By Pod Name",
    label: "Pod Name",
    icon: <LetterIcon className="w-6 h-6 mr-2" stroke="white" />,
  },
  {
    value: "Search By Tag",
    label: "Tags",
    icon: <TagIcon className="w-6 h-6 mr-2" stroke="white" />,
  },
  {
    value: "Ask AI",
    label: "Ask AI",
    icon: <StarIcon className="w-6 h-6 mr-2" stroke="white" />,
  },
];

const Dropdown = ({
  isDropdownOpen,
  setIsDropdownOpen,
  selectedOption,
  setSelectedOption,
  setIsTagMenuOpen,
  dropdownRef,
}: any) => {
  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    setIsTagMenuOpen(option.value === "Search By Tag");
    setIsDropdownOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="bg-[#3D3D3D] px-4 flex items-center z-10 hover:bg-[#4A4A4A] transition-colors rounded-l-2xl h-full"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedOption.icon || options[0].icon}
      </button>
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.4 }}
          className="absolute top-full mt-2 bg-[#3D3D3D] rounded-lg shadow-lg z-50 w-48"
        >
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full flex items-center px-4 py-3 text-sm text-white hover:bg-[#4A4A4A] transition-all rounded-lg"
              onClick={() => handleOptionClick(option)}
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dropdown;
