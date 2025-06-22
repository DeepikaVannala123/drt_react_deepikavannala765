import React from 'react';
import { CheckCircle, ArrowRight, Trash2, Satellite, X } from 'lucide-react';
import { useSelectedSatellites } from '../contexts/SelectedSatellitesContext';

interface SelectionPanelProps {
  onProceed: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({ onProceed }) => {
  const { selectedSatellites, clearSelection, removeSatellite } = useSelectedSatellites();

  const handleRemoveIndividual = (noradCatId: string) => {
    removeSatellite(noradCatId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-slate-900">
            Selected ({selectedSatellites.length}/10)
          </h3>
        </div>
        {selectedSatellites.length > 0 && (
          <button
            onClick={clearSelection}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 transition-colors"
            title="Clear all selections"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedSatellites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Satellite className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm font-medium">No satellites selected</p>
            <p className="text-slate-400 text-xs mt-1">Select up to 10 satellites from the table</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedSatellites.map((satellite) => (
              <div 
                key={satellite.noradCatId} 
                className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <div className="font-medium text-slate-900 truncate text-sm">
                    {satellite.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    ID: {satellite.noradCatId}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {satellite.objectType} • {satellite.countryCode}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveIndividual(satellite.noradCatId)}
                  className="flex-shrink-0 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 
                           rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove this satellite"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedSatellites.length > 0 && (
        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={onProceed}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white 
                     font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 
                     focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
          >
            Proceed with Selection
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};