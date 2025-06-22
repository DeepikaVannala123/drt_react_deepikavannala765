import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronUp, ChevronDown, Calendar, MapPin, Satellite as SatelliteIcon } from 'lucide-react';
import type { Satellite, SortField, SortConfig } from '../types/satellite';
import { useSelectedSatellites } from '../contexts/SelectedSatellitesContext';

interface SatelliteTableProps {
  satellites: Satellite[];
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  showSelection?: boolean;
}

export const SatelliteTable: React.FC<SatelliteTableProps> = ({
  satellites,
  sortConfig,
  onSort,
  showSelection = true
}) => {
  const { isSelected, addSatellite, removeSatellite, maxSelectionReached } = useSelectedSatellites();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: satellites.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const handleRowSelect = (satellite: Satellite, checked: boolean) => {
    if (!showSelection) return;

    if (checked) {
      const success = addSatellite(satellite);
      if (!success && maxSelectionReached) {
        alert('Maximum 10 satellites can be selected');
      }
    } else {
      removeSatellite(satellite.noradCatId);
    }
  };

  const SortButton: React.FC<{ field: SortField; label: string; mandatory?: boolean }> = ({
    field,
    label,
    mandatory
  }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-left font-medium text-slate-700 hover:text-slate-900 transition-colors group"
    >
      {label}
      {mandatory && <span className="text-red-500 text-xs">*</span>}
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortConfig.field === field && sortConfig.direction === 'asc'
              ? 'text-blue-600'
              : 'text-slate-400 group-hover:text-slate-600'
          } transition-colors`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortConfig.field === field && sortConfig.direction === 'desc'
              ? 'text-blue-600'
              : 'text-slate-400 group-hover:text-slate-600'
          } transition-colors`}
        />
      </div>
    </button>
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getObjectTypeColor = (type: string) => {
    switch (type) {
      case 'PAYLOAD': return 'bg-green-100 text-green-800';
      case 'ROCKET BODY': return 'bg-blue-100 text-blue-800';
      case 'DEBRIS': return 'bg-red-100 text-red-800';
      case 'UNKNOWN': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (satellites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <SatelliteIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No satellites found</h3>
        <p className="text-slate-500">Try adjusting your search or filters to find satellites.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 items-center text-xs font-medium text-slate-500">
          {showSelection && <div className="col-span-1">SELECT</div>}
          <div className={showSelection ? 'col-span-3' : 'col-span-4'}>
            <SortButton field="name" label="Name" mandatory />
          </div>
          <div className="col-span-2">
            <SortButton field="noradCatId" label="NORAD ID" mandatory />
          </div>
          <div className="col-span-2 hidden md:block">OBJECT TYPE</div>
          <div className="col-span-1 hidden md:block">ORBIT</div>
          <div className="col-span-2 hidden md:block">Country</div>
          <div className="col-span-1 hidden md:block">Launch</div>
        </div>
      </div>

      {/* Virtualized List */}
      <div ref={parentRef} className="h-96 overflow-auto" style={{ contain: 'strict' }}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const satellite = satellites[virtualRow.index];
            const selected = isSelected(satellite.noradCatId);

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  selected ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
              >
                <div className="grid grid-cols-6 md:grid-cols-12 gap-4 items-center p-4 h-full text-sm">
                  {showSelection && (
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => handleRowSelect(satellite, e.target.checked)}
                        disabled={!selected && maxSelectionReached}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                      />
                    </div>
                  )}
                  <div className={showSelection ? 'col-span-3' : 'col-span-4'}>
                    <div className="font-medium text-slate-900 truncate">{satellite.name}</div>
                    <div className="text-xs text-slate-500">{satellite.intlDes}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="font-mono text-sm text-slate-700">{satellite.noradCatId}</span>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getObjectTypeColor(
                        satellite.objectType
                      )}`}
                    >
                      {satellite.objectType}
                    </span>
                  </div>
                  <div className="col-span-1 hidden md:block">
                    <span className="text-xs font-mono text-slate-600">
                      {satellite.orbitCode.replace(/[{}]/g, '')}
                    </span>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-sm text-slate-600">{satellite.countryCode}</span>
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:block">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{formatDate(satellite.launchDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Showing {satellites.length} satellites</div>
          {showSelection && (
            <div className="text-sm text-slate-600">
              <span className="font-medium">
                {satellites.filter((s) => isSelected(s.noradCatId)).length}
              </span>{' '}
              of 10 selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
