import React, { RefObject } from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isSearchFocused: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  isSearchFocused,
  inputRef,
}) => (
  <div className="relative mt-6 group transition-all duration-500 w-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute left-2 sm:left-4 top-6 sm:top-8 h-6 sm:w-6 w-5 -translate-y-1/2 text-gray-400 transition-all duration-300 ${isSearchFocused ? "left-1 sm:left-6 h-7 w-7" : ""
        }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    <input
      ref={inputRef}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      type="text"
      placeholder="Search doctor by name or department"
      className={`w-full rounded-lg bg-white py-3 pl-7 sm:pl-10 pr-4 text-base shadow-lg outline-none ring-1 ring-gray-100 lg:py-4 lg:text-lg
        transition-all duration-500 ease-in-out
        ${isSearchFocused
          ? "scale-105 shadow-xl ring-2 ring-blue-400 pl-10 sm:pl-14"
          : ""
        }`}
    />
    <div className="mt-3 text-xs text-gray-500">
      <span className="font-medium">Tip:</span> Only search by <span className="font-medium">Name & Surname</span>{" "}
      (without Dr / Dr. and so on)
    </div>
  </div>
);

export default SearchBar;
