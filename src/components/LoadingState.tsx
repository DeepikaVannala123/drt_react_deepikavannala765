import React from 'react';
import { Satellite, Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
      <div className="flex items-center justify-center mb-4">
        <Satellite className="h-8 w-8 text-blue-500 animate-pulse mr-2" />
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">Loading satellites...</h3>
      <p className="text-slate-500">Fetching data from space tracking network</p>
    </div>
  );
};