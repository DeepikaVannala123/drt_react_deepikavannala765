import React, { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<Props> = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      onSearch(value.trim());
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search by name or NORAD ID"
      className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
    />
  );
};

export default SearchInput;
