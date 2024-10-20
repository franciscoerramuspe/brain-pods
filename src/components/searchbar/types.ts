import { ReactNode } from 'react';

export interface Option {
  value: string;
  label: string;
  icon: ReactNode;
}

export interface Pod {
  id: string;
  name: string;
  tags: string[];
}

export interface SearchBarProps {
  onSearch: (term: string, option: Option) => void;
}

export interface DropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectedOption: Option;
  setSelectedOption: (option: Option) => void;
  setIsTagMenuOpen: (isOpen: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export interface TagMenuProps {
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  pods: Pod[];
  menuRef: React.RefObject<HTMLDivElement>;
}

