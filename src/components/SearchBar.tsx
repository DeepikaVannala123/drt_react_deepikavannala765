import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  hasActiveFilters?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterClick,
  hasActiveFilters = false,
  placeholder = "Search by name or NORAD Cat ID..." 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 text-slate-900 placeholder-slate-500"
          />
        </div>
        
        <button
          type="button"
          onClick={onFilterClick}
          className={`px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 
                     flex items-center gap-2 font-medium relative
                     ${hasActiveFilters 
                       ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                       : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                     }`}
        >
          <Filter className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </form>
      <p className="mt-2 text-sm text-slate-500">
        Press Enter to search
      </p>
    </div>
  );
};