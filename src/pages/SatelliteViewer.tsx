import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Satellite as SatelliteIcon } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterSidebar } from '../components/FilterSidebar';
import { SatelliteTable } from '../components/SatelliteTable';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { SelectionPanel } from '../components/SelectionPanel';
import { satelliteApi } from '../services/satelliteApi';
import type { SearchFilters, SortConfig, Satellite } from '../types/satellite';

interface SatelliteViewerProps {
  onProceedToSelection: () => void;
}

export const SatelliteViewer: React.FC<SatelliteViewerProps> = ({ onProceedToSelection }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    objectTypes: [],
    orbitCodes: []
  });
  
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(filters);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });
  
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['satellites', appliedFilters],
    queryFn: () => satelliteApi.fetchSatellites(appliedFilters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setAppliedFilters(prev => ({ ...prev, search: query }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const handleSort = useCallback((field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const hasActiveFilters = filters.objectTypes.length > 0 || filters.orbitCodes.length > 0;

  // Filter and sort satellites
  const processedSatellites = useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    // Apply search filter
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      filtered = filtered.filter(satellite =>
        satellite.name.toLowerCase().includes(searchLower) ||
        satellite.noradCatId.includes(searchLower)
      );
    }

    // Apply orbit code filter
    if (appliedFilters.orbitCodes.length > 0) {
      filtered = filtered.filter(satellite =>
        appliedFilters.orbitCodes.some(code =>
          satellite.orbitCode.includes(code)
        )
      );
    }

    // Sort satellites
    return [...filtered].sort((a, b) => {
      const { field, direction } = sortConfig;
      let aValue: string | number | null = a[field];
      let bValue: string | number | null = b[field];

      // Handle null values
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return direction === 'asc' ? 1 : -1;
      if (bValue === null) return direction === 'asc' ? -1 : 1;

      // Convert to comparable values
      if (field === 'launchDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    });
  }, [data?.data, appliedFilters, sortConfig]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState 
            error={error instanceof Error ? error.message : 'An unexpected error occurred'} 
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SatelliteIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Satellite Data Viewer</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Search, filter, and explore satellite data from the global space tracking network. 
            Select up to 10 satellites for detailed analysis.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            onFilterClick={() => setIsFilterSidebarOpen(true)}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
                    {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            {isLoading ? (
              <div className="h-96">
                <LoadingState />
              </div>
            ) : (
              <SatelliteTable
                satellites={processedSatellites}
                sortConfig={sortConfig}
                onSort={handleSort}
                showSelection={true}
              />
            )}
          </div>
          {/* Selection Panel */}
          <div className="lg:col-span-1 order-2 lg:order-2">
            <SelectionPanel onProceed={onProceedToSelection} />
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        counts={data?.counts}
        isLoading={isLoading}
      />
    </div>
  );
};