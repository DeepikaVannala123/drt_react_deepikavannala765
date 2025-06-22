import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Satellite } from '../types/satellite';
import type { ReactNode } from 'react';

interface SelectedSatellitesContextType {
  selectedSatellites: Satellite[];
  addSatellite: (satellite: Satellite) => boolean;
  removeSatellite: (noradCatId: string) => void;
  clearSelection: () => void;
  isSelected: (noradCatId: string) => boolean;
  maxSelectionReached: boolean;
}

const SelectedSatellitesContext = createContext<SelectedSatellitesContextType | undefined>(undefined);

const MAX_SELECTIONS = 10;
const STORAGE_KEY = 'selectedSatellites';

export const SelectedSatellitesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSatellites, setSelectedSatellites] = useState<Satellite[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedSatellites(parsed);
        }
      } catch (error) {
        console.error('Failed to parse stored satellites:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever selection changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSatellites));
      } catch (error) {
        console.error('Failed to save satellites to localStorage:', error);
      }
    }
  }, [selectedSatellites, isInitialized]);

  const addSatellite = (satellite: Satellite): boolean => {
    if (selectedSatellites.length >= MAX_SELECTIONS) {
      return false;
    }
    
    if (!isSelected(satellite.noradCatId)) {
      setSelectedSatellites(prev => [...prev, satellite]);
      return true;
    }
    
    return false;
  };

  const removeSatellite = (noradCatId: string) => {
    setSelectedSatellites(prev => prev.filter(s => s.noradCatId !== noradCatId));
  };

  const clearSelection = () => {
    setSelectedSatellites([]);
  };

  const isSelected = (noradCatId: string): boolean => {
    return selectedSatellites.some(s => s.noradCatId === noradCatId);
  };

  const maxSelectionReached = selectedSatellites.length >= MAX_SELECTIONS;

  return (
    <SelectedSatellitesContext.Provider value={{
      selectedSatellites,
      addSatellite,
      removeSatellite,
      clearSelection,
      isSelected,
      maxSelectionReached
    }}>
      {children}
    </SelectedSatellitesContext.Provider>
  );
};

export const useSelectedSatellites = () => {
  const context = useContext(SelectedSatellitesContext);
  if (context === undefined) {
    throw new Error('useSelectedSatellites must be used within a SelectedSatellitesProvider');
  }
  return context;
};