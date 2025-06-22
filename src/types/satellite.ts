export interface Satellite {
  noradCatId: string;
  intlDes: string;
  name: string;
  launchDate: string | null;
  decayDate: string | null;
  objectType: ObjectType;
  launchSiteCode: string;
  countryCode: string;
  orbitCode: string;
}

export type ObjectType = "ROCKET BODY" | "DEBRIS" | "UNKNOWN" | "PAYLOAD";

export type OrbitCode = "LEO" | "LEO1" | "LEO2" | "LEO3" | "LEO4" | "MEO" | "GEO" | "HEO" | "IGO" | "EGO" | "NSO" | "GTO" | "GHO" | "HAO" | "MGO" | "LMO" | "UFO" | "ESO" | "UNK";

export interface SatelliteApiResponse {
  data: Satellite[];
  counts: {
    total: string;
    PAYLOAD: string;
    "ROCKET BODY": string;
    UNKNOWN: string;
    DEBRIS: string;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
}

export interface SearchFilters {
  search: string;
  objectTypes: ObjectType[];
  orbitCodes: OrbitCode[];
}

export type SortField = 'name' | 'noradCatId' | 'launchDate' | 'countryCode';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}