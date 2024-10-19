import React, { useState, useRef, useEffect } from 'react';
import { AiIcon, LightningIcon } from './Icons';

const SearchBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    { value: 'Search By Pod Name', label: 'Pod Name', icon: <AiIcon className="w-6 h-6 mr-2" stroke="white" /> },
    { value: 'Search By Tag', label: 'Tags', icon: <AiIcon className="w-6 h-6 mr-2" stroke="white" /> },
    { value: 'Ask AI', label: 'Ask AI', icon: <AiIcon className="w-6 h-6 mr-2" stroke="white" /> },
  ];

  return (
    <div className="flex items-stretch bg-[#4A4A4A] rounded-2xl w-full max-w-2xl mx-auto relative h-14">
      <div ref={dropdownRef} className="relative">
        <button
          className="bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-200 rounded-l-2xl h-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <AiIcon className="w-8 h-8" stroke="white" />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 bg-[#3D3D3D] rounded-md shadow-lg z-50 w-48">
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full flex items-center px-4 py-3 text-sm text-white hover:bg-[#4A4A4A] transition-colors duration-200"
                onClick={() => {
                  // Handle option selection here
                  setIsDropdownOpen(false);
                }}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="What do you want to brain at?"
        className="bg-transparent text-white placeholder-gray-400 flex-grow outline-none px-4 py-3 text-lg"
      />
      <button className="bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-200 rounded-r-2xl">
        <LightningIcon className="w-8 h-8" stroke="white" />
      </button>
    </div>
  );
};

export default SearchBar;
