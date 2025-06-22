import React from 'react';
import { ArrowLeft, Satellite as SatelliteIcon, Download, Share } from 'lucide-react';
import { useSelectedSatellites } from '../contexts/SelectedSatellitesContext';

interface SelectedSatellitesProps {
  onBack: () => void;
}

export const SelectedSatellites: React.FC<SelectedSatellitesProps> = ({ onBack }) => {
  const { selectedSatellites, clearSelection } = useSelectedSatellites();

  const handleExport = () => {
    const data = selectedSatellites.map((satellite:any) => ({
      name: satellite.name,
      noradCatId: satellite.noradCatId,
      objectType: satellite.objectType,
      launchDate: satellite.launchDate,
      countryCode: satellite.countryCode,
      orbitCode: satellite.orbitCode
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-satellites.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Selected Satellites',
          text: `I've selected ${selectedSatellites.length} satellites for analysis`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      const text = selectedSatellites.map((s:any) => `${s.name} (${s.noradCatId})`).join('\n');
      await navigator.clipboard.writeText(text);
      alert('Satellite list copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 
                     hover:bg-white rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <SatelliteIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Selected Satellites</h1>
            </div>
            <p className="text-slate-600 mt-1">
              {selectedSatellites.length} satellite{selectedSatellites.length !== 1 ? 's' : ''} selected for analysis
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 
                       hover:bg-white rounded-lg transition-all duration-200"
            >
              <Share className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                       hover:bg-blue-700 rounded-lg transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {selectedSatellites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <SatelliteIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No satellites selected</h3>
            <p className="text-slate-500 mb-6">Go back to the search page to select satellites for analysis.</p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       transition-all duration-200"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-12 gap-4 items-center font-medium text-slate-700">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">NORAD Cat ID</div>
                <div className="col-span-2">Object Type</div>
                <div className="col-span-2">Country</div>
                <div className="col-span-2">Launch Date</div>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {selectedSatellites.map((satellite:any, index:any) => (
                <div key={satellite.noradCatId} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="font-medium text-slate-900">{satellite.name}</div>
                      <div className="text-sm text-slate-500">{satellite.intlDes}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="font-mono text-sm text-slate-700">{satellite.noradCatId}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${satellite.objectType === 'PAYLOAD' ? 'bg-green-100 text-green-800' :
                          satellite.objectType === 'ROCKET BODY' ? 'bg-blue-100 text-blue-800' :
                          satellite.objectType === 'DEBRIS' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {satellite.objectType}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-slate-600">{satellite.countryCode}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-slate-600">
                        {satellite.launchDate ? 
                          new Date(satellite.launchDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Total: {selectedSatellites.length} satellites
                </div>
                <button
                  onClick={clearSelection}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Clear All Selections
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};