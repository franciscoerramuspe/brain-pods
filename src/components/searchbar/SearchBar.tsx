import React, { useState, useRef, useEffect } from "react";
import { LightningIcon, LetterIcon } from "../Icons";
import Dropdown from "./Dropdown";
import TagMenu from "./TagMenu";
import { supabase } from "../../lib/supabase";
import { Option, Pod, SearchBarProps } from "./types";
import { Groq } from "groq-sdk";
import { getGroqChatCompletion } from "@/app/api/models/groq/route";

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>({
    value: "Search By Pod Name",
    label: "Pod Name",
    icon: <LetterIcon className="w-6 h-6 mr-2" stroke="white" />,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pods, setPods] = useState<Pod[]>([]);
  const [suggestions, setSuggestions] = useState<Pod[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsTagMenuOpen(false);
      }
    };

    const handleSuggestionsClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleSuggestionsClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleSuggestionsClickOutside);
    };
  }, []);

  const hanndleAiSearch = async() => {
    if (selectedOption.value !== "Ask AI" || !searchTerm) return; 
  
    setIsAiSearching(true);
  
    const tags: String[] = ["MATH", "ALGORITHMS", "BIOLOGY", "HISTORY", "CHEMISTRY", "HASHMAPS", "CALCULUS", "ALGEBRA", "GEOMETRY", "SPANISH", "LAW", "ETHICS", "PHYSICS"];
  
    try {
      const completion = await getGroqChatCompletion([
        { role: "system", content: "You are an AI assistant that helps users find relevant study pods based on their interests." },
        { role: "user", content: `I want to study about ${searchTerm}. Suggest some relevant topics or tags that might be associated with this subject. Tags that the app currently have are: ${tags.join(", ")}. Only answer with tags that are in the list separated by commas.` }
      ]);
      
      const suggestedTags = completion.choices[0].message.content
        .split(",")
        .map((tag: string) => tag.trim().toUpperCase())
        .filter((tag: string) => tags.includes(tag));
  
      console.log("suggestedTags ", suggestedTags);
  
      let query = supabase
        .from("pod")
        .select("*, pod_topic(topic_name)")
        .match({is_active: true, is_public: true});
  
      const { data: podTopicData, error: topicError } = await supabase
        .from("pod_topic")
        .select("pod_id")
        .in("topic_name", suggestedTags);
  
      if (topicError) {
        console.error("Error fetching pods by tags:", topicError);
        return;
      }
  
      const podIds = podTopicData.map((topic) => topic.pod_id);
      query = query.in("id", podIds);
  
      const { data: podData, error: podError } = await query;
  
      if (podError) {
        console.error("Error fetching pods:", podError);
      } else {
        const podsWithTags = podData.map((pod: any) => ({
          ...pod,
          tags: pod.pod_topic.map((topic: any) => topic.topic_name),
        }));
        setSuggestions(podsWithTags);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching AI search results:", error);
      setSuggestions([]);
      setShowSuggestions(true);
    } finally {
      setIsAiSearching(false);
    }
  }

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("pod_tag").select("tag");
      if (error) console.error("Error fetching tags:", error);
      else setTags(data.map((tagObj: any) => tagObj.tag));
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPods = async () => {
      if (searchTerm.length === 0 && selectedTags.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      let query = supabase
      .from("pod")
      .select("*, pod_topic(topic_name)")
        .match({is_active: true, is_public: true});
  
      if (selectedOption.value === "Search By Pod Name" && searchTerm.length > 0) {
      query = query.ilike("name", `%${searchTerm}%`);
    } else if (selectedOption.value === "Search By Tag" && selectedTags.length > 0) {
      const { data: podTopicData, error: topicError } = await supabase
        .from("pod_topic")
        .select("pod_id")
        .in("topic_name", selectedTags);

      if (topicError) {
        console.error("Error fetching pods by tags:", topicError);
        return;
      }

      const podIds = podTopicData.map((topic) => topic.pod_id);
      query = query.in("id", podIds);
      }

      const { data: podData, error: podError } = await query;
      if (podError) {
        console.error("Error fetching pods:", podError);
      } else {
        const podsWithTags = podData.map((pod: any) => ({
          ...pod,
          tags: pod.pod_topic.map((topic: any) => topic.topic_name),
        }));
        setSuggestions(podsWithTags);
        setShowSuggestions(true);
      }
    };
  
    const debounce = setTimeout(() => {
      fetchPods();
    }, 300);
  
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedTags, selectedOption]);

  const handleSearch = () => {
    if (selectedOption.value === "Ask AI") {
      hanndleAiSearch();
    } else {
      onSearch(searchTerm, selectedOption);
    }
  };

  const handleOptionChange = (newOption: Option) => {
    setSelectedOption(newOption);
    if (newOption.value === "Search By Tag") {
      setSearchTerm("Select tags to search");
    } else {
      setSearchTerm("");
    }
  };

  const getPlaceholder = () => {
    if (selectedOption.value === "Search By Pod Name") {
      return "Search by Pod Name";
    } else if (selectedOption.value === "Ask AI") {
      return "I want to study about...";
    } else if (selectedOption.value === "Search By Tag") {
      return "Select tags to search";
    }
    return "";
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-stretch bg-[#4A4A4A] rounded-2xl h-14 p-1">
        <Dropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedOption={selectedOption}
          setSelectedOption={handleOptionChange}
          setIsTagMenuOpen={setIsTagMenuOpen}
          dropdownRef={dropdownRef}
        />

        <input
          ref={searchInputRef}
          type="text"
          placeholder={getPlaceholder()}
          className={`bg-[#323232] text-white placeholder-gray-400 flex-grow outline-none px-4 py-3 text-lg ${
            !["Search By Pod Name", "Ask AI"].includes(selectedOption.value)
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!["Search By Pod Name", "Ask AI"].includes(selectedOption.value)}
        />

        <button
          className={`bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-300 rounded-r-2xl ${
            selectedOption.value === "Ask AI" ? "hover:bg-[#4A4A4A]" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleSearch}
          disabled={isAiSearching || selectedOption.value !== "Ask AI"}
        >
          {isAiSearching ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          ) : (
            <LightningIcon className="w-8 h-8" stroke="white" />
          )}
        </button>
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 top-full mt-2 p-2 bg-[#3D3D3D] max-h-[60vh] overflow-y-auto rounded-lg shadow-lg w-full z-10"
        >
          <ul>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="text-white bg-zinc-700 rounded-lg p-3 shadow-lg flex flex-col justify-between mb-2"
              >
                <div className="flex flex-row justify-between">
                  <div>
                    <p className="text-lg">{suggestion.name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestion.tags.map((tag: string) => (
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
                    onClick={() =>
                      (window.location.href = `/pod/${suggestion.id}`)
                    }
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

      {isTagMenuOpen && (
        <TagMenu
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          pods={pods}
          menuRef={menuRef}
        />
      )}
    </div>
  );
};

export default SearchBar;
