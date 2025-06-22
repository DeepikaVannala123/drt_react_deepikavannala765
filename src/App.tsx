import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SelectedSatellitesProvider } from './contexts/SelectedSatellitesContext';
import { SatelliteViewer } from './pages/SatelliteViewer';
import { SelectedSatellites } from './pages/SelectedSatellites';
import Header from './components/Header';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'selected'>('search');

  const handleProceedToSelection = () => setCurrentView('selected');
  const handleBackToSearch = () => setCurrentView('search');

  return (
    <QueryClientProvider client={queryClient}>
      <SelectedSatellitesProvider>
        <div className="flex flex-col min-h-screen">
  
          <main className="flex-grow  bg-gray-50 overflow-y-auto">
            {currentView === 'search' ? (
              <SatelliteViewer onProceedToSelection={handleProceedToSelection} />
            ) : (
              <SelectedSatellites onBack={handleBackToSearch} />
            )}
          </main>
        </div>
      </SelectedSatellitesProvider>
    </QueryClientProvider>
  );
}

export default App;


