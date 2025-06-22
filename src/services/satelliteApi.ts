import type { SatelliteApiResponse, SearchFilters, ObjectType, OrbitCode } from '../types/satellite';

const isDev = import.meta.env.DEV;

const API_BASE_URL = isDev
  ? '/api/v1' // local proxy path
  : 'https://backend.digantara.dev/v1'; // real API in prod


const OBJECT_TYPES: ObjectType[] = ["ROCKET BODY", "DEBRIS", "UNKNOWN", "PAYLOAD"];
const ORBIT_CODES: OrbitCode[] = [
  "LEO", "LEO1", "LEO2", "LEO3", "LEO4", "MEO", "GEO", "HEO", 
  "IGO", "EGO", "NSO", "GTO", "GHO", "HAO", "MGO", "LMO", "UFO", "ESO", "UNK"
];

export const satelliteApi = {
  async fetchSatellites(filters: SearchFilters): Promise<SatelliteApiResponse> {
    const params = new URLSearchParams();
    
    // Add object types
    if (filters.objectTypes.length > 0) {
      params.append('objectTypes', filters.objectTypes.join(','));
    } else {
      params.append('objectTypes', OBJECT_TYPES.join(','));
    }
    
    // Add all attributes
    params.append('attributes', 'noradCatId,intlDes,name,launchDate,decayDate,objectType,launchSiteCode,countryCode,orbitCode');
    
    const url = `${API_BASE_URL}/satellites?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch satellites');
    }
    
    return response.json();
  },

  getObjectTypes: () => OBJECT_TYPES,
  getOrbitCodes: () => ORBIT_CODES,
};