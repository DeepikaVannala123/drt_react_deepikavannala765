import React from 'react';
import { Filter, X } from 'lucide-react';
import type { ObjectType, OrbitCode, SearchFilters } from '../types/satellite';
import { satelliteApi } from '../services/satelliteApi';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  counts?: Record<string, string>;
  isLoading?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
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
      : filters.objectTypes.filter(t => t !== type);
    
    onFiltersChange({
      ...filters,
      objectTypes: newObjectTypes
    });
  };

  const handleOrbitCodeChange = (code: OrbitCode, checked: boolean) => {
    const newOrbitCodes = checked
      ? [...filters.orbitCodes, code]
      : filters.orbitCodes.filter(c => c !== code);
    
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors px-2 py-1 rounded"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Object Types */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-4">Object Type</h4>
                <div className="space-y-3">
                  {objectTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.objectTypes.includes(type)}
                        onChange={(e) => handleObjectTypeChange(type, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                                 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex-1">
                        {type}
                      </span>
                      {counts && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                          {counts[type] || '0'}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Orbit Codes */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-4">Orbit Code</h4>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  {orbitCodes.map((code) => (
                    <label key={code} className="flex items-center gap-2 cursor-pointer group p-1 rounded hover:bg-slate-50 transition-colors">
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

              {/* Total Count */}
              {counts && (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-500">Total Satellites</div>
                  <div className="text-2xl font-bold text-slate-900">{counts.total || '0'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Filters'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};