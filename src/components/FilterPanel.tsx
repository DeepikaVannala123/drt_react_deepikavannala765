import React from 'react';
import { Filter, X } from 'lucide-react';
import type { ObjectType, OrbitCode, SearchFilters } from '../types/satellite';
import { satelliteApi } from '../services/SatelliteApi';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  counts?: Record<string, string>;
  isLoading?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  counts,
  isLoading
}) => {
  const objectTypes = satelliteApi.getObjectTypes();
  const orbitCodes = satelliteApi.getOrbitCodes();

  const handleObjectTypeChange = (type: ObjectType, checked: boolean) => {
    const newObjectTypes = checked
      ? [...filters.objectTypes, type]
      : filters.objectTypes.filter((t:any) => t !== type);
    
    onFiltersChange({
      ...filters,
      objectTypes: newObjectTypes
    });
  };

  const handleOrbitCodeChange = (code: OrbitCode, checked: boolean) => {
    const newOrbitCodes = checked
      ? [...filters.orbitCodes, code]
      : filters.orbitCodes.filter((c:any)=> c !== code);
    
    onFiltersChange({
      ...filters,
      orbitCodes: newOrbitCodes
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: filters.search,
      objectTypes: [],
      orbitCodes: []
    });
  };

  const hasActiveFilters = filters.objectTypes.length > 0 || filters.orbitCodes.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Object Types */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Object Type</h4>
          <div className="space-y-2">
            {objectTypes.map((type:any) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.objectTypes.includes(type)}
                  onChange={(e) => handleObjectTypeChange(type, e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                           focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {type}
                </span>
                {counts && (
                  <span className="text-xs text-slate-400 ml-auto">
                    {counts[type] || '0'}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Orbit Codes */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Orbit Code</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {orbitCodes.map((code:any) => (
              <label key={code} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.orbitCodes.includes(code)}
                  onChange={(e) => handleOrbitCodeChange(code, e.target.checked)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded 
                           focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">
                  {code}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={onApplyFilters}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </button>
        </div>

        {/* Total Count */}
        {counts && (
          <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-200">
            Total: {counts.total || '0'} satellites
          </div>
        )}
      </div>
    </div>
  );
};