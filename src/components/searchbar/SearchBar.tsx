import React, { useState, useRef, useEffect } from "react";
import { LightningIcon, LetterIcon } from "../Icons";
import Dropdown from "./Dropdown";
import TagMenu from "./TagMenu";
import { supabase } from "../../lib/supabase";

const SearchBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: "Search By Pod Name",
    label: "Pod Name",
    icon: <LetterIcon className="w-6 h-6 mr-2" stroke="white" />,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado del texto de búsqueda
  const [pods, setPods] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]); // Estado para las sugerencias
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
    const fetchPods = async () => {
      // No continuar si no hay búsqueda por tags o por nombre
      if (searchTerm.length === 0 && selectedTags.length === 0) return;

      let query = supabase
        .from("pod")
        .select("*, pod_topic(topic_name)")
        .eq("is_active", true) // Solo pods activos
        .eq("is_public", true); // Solo pods públicos

      // Filtro por nombre de pod si la opción "Search By Pod Name" está activada y el usuario está escribiendo
      if (
        searchTerm.length > 0 &&
        selectedOption.value === "Search By Pod Name"
      ) {
        query = query.ilike("name", `%${searchTerm}%`); // Filtro por nombre del pod
      }

      // Filtro por tags seleccionados si la opción "Search By Tag" está activada
      if (selectedTags.length > 0 && selectedOption.value === "Search By Tag") {
        const { data: podTopicData, error } = await supabase
          .from("pod_topic")
          .select("pod_id, topic_name")
          .in("topic_name", selectedTags);

        if (error) {
          console.error("Error fetching pods by tags:", error);
        } else {
          const podIds = podTopicData.map((topic: any) => topic.pod_id);
          query = query.in("id", podIds); // Filtrar por los pods encontrados con tags seleccionados
        }
      }

      const { data: podData, error: podError } = await query;
      if (podError) {
        console.error("Error fetching pods:", podError);
      } else {
        const podsWithTags = podData.map((pod: any) => ({
          ...pod,
          tags: pod.pod_topic.map((topic: any) => topic.topic_name),
        }));

        setPods(podsWithTags);

        // Si estamos buscando por nombre, actualizamos las sugerencias
        if (
          searchTerm.length > 0 &&
          selectedOption.value === "Search By Pod Name"
        ) {
          setSuggestions(podsWithTags); // Guardar las sugerencias si la búsqueda por nombre está activa
        } else {
          setSuggestions([]); // Limpiar sugerencias si no hay búsqueda por nombre
        }
      }
    };

    fetchPods();
  }, [selectedTags, searchTerm, selectedOption]);

  // Add this new function
  const handleOptionChange = (newOption: any) => {
    setSelectedOption(newOption);
    if (newOption.value === "Search By Tag") {
      setSearchTerm("");
    }
  };

  const getPlaceholder = () => {
    if (selectedOption.value === "Search By Pod Name") {
      return "Search by Pod Name";
    } else if (selectedOption.value === "Ask AI") {
      return "I want to study about...";
    }
    return "";
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* SearchBar Component */}
      <div className="flex items-stretch bg-[#4A4A4A] rounded-2xl h-14 p-1">
        <Dropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedOption={selectedOption}
          setSelectedOption={handleOptionChange}
          setIsTagMenuOpen={setIsTagMenuOpen}
          dropdownRef={dropdownRef}
        />

        <input
          type="text"
          placeholder={getPlaceholder()}
          className={`bg-[#323232] text-white placeholder-gray-400 flex-grow outline-none px-4 py-3 text-lg ${
            !["Search By Pod Name", "Ask AI"].includes(selectedOption.value)
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={
            !["Search By Pod Name", "Ask AI"].includes(selectedOption.value)
          }
        />

        <button className="bg-[#3D3D3D] px-4 flex items-center justify-center hover:bg-[#4A4A4A] transition-colors duration-300 rounded-r-2xl">
          <LightningIcon className="w-8 h-8" stroke="white" />
        </button>
      </div>

      {/* Mostrar sugerencias si el usuario está escribiendo y se encuentra en la opción de búsqueda por nombre */}
      {suggestions.length > 0 &&
        selectedOption.value === "Search By Pod Name" && (
          <div className="mt-2 p-2 bg-[#3D3D3D] rounded-lg shadow-lg">
            <ul>
              {suggestions.map((suggestion: any) => (
                <li
                  key={suggestion.id}
                  className="text-white bg-zinc-700 rounded-lg p-3 shadow-lg flex flex-col justify-between  mb-2"
                >
                  <div className="flex flex-row justify-between">
                    <div>
                      <p className="text-lg">{suggestion.name}</p>

                      {/* Mostrar todas las etiquetas del pod debajo del nombre */}
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
                      } // Navegar a la sala seleccionada
                      className="bg-white text-black font-semibold  px-8 py-2 rounded-lg mt-4 self-start"
                    >
                      Join Pod
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
