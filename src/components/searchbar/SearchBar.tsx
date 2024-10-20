import React, { useState, useRef, useEffect } from "react";
import { LightningIcon } from "../Icons";
import Dropdown from "./Dropdown";
import TagMenu from "./TagMenu";
import RoomsList from "./RoomsList";
import { supabase } from "../../lib/supabase";

const SearchBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({} as any);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pods, setPods] = useState<any[]>([]);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("pod_tag").select("tag");
      if (error) console.error("Error fetching tags:", error);
      else setTags(data.map((tagObj: any) => tagObj.tag));
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPodsByTags = async () => {
      if (selectedTags.length === 0) return;

      const { data, error } = await supabase
        .from("pod_topic")
        .select("pod_id, topic_name")
        .in("topic_name", selectedTags);

      if (error) {
        console.error("Error fetching pods by tags:", error);
      } else {
        const podIds = data.map((topic: any) => topic.pod_id);
        const { data: podData, error: podError } = await supabase
          .from("pod")
          .select("*")
          .in("id", podIds)
          .eq("is_active", true) // Solo pods activos
          .eq("is_public", true); // Solo pods públicos

        if (podError) console.error("Error fetching pods:", podError);
        else setPods(podData);
      }
    };

    fetchPodsByTags();
  }, [selectedTags]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* SearchBar Component */}
      <div className="flex items-stretch bg-[#4A4A4A] rounded-2xl h-14 p-1">
        <Dropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          setIsTagMenuOpen={setIsTagMenuOpen}
          dropdownRef={dropdownRef}
        />

        <input
          type="text"
          placeholder="What do you want to brain at?"
          className="bg-[#323232] text-white placeholder-gray-400 flex-grow outline-none px-4 py-3 text-lg"
        />

        <button className="bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-300 rounded-r-2xl">
          <LightningIcon className="w-8 h-8" stroke="white" />
        </button>
      </div>

      {/* Dropdown (TagMenu) appears below without affecting SearchBar */}
      {isTagMenuOpen && (
        <TagMenu
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          pods={pods}
        />
      )}
    </div>
  );
};

export default SearchBar;
