
import { Property, POI } from './data';

// Generic function to find the best match from an array based on a name
export function findBestMatch<T>(
  query: string,
  items: T[],
  getName: (item: T) => string
): T | null {
  if (!query || !items || items.length === 0) {
    return null;
  }
  
  // Normalize the query
  const normalizedQuery = query.toLowerCase();
  
  // First try exact match
  const exactMatch = items.find(item => 
    getName(item).toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // Then try includes match
  const includesMatches = items.filter(item => 
    getName(item).toLowerCase().includes(normalizedQuery) || 
    normalizedQuery.includes(getName(item).toLowerCase())
  );
  
  if (includesMatches.length > 0) {
    // Sort by closest length match as a simple heuristic
    includesMatches.sort((a, b) => 
      Math.abs(getName(a).length - normalizedQuery.length) - 
      Math.abs(getName(b).length - normalizedQuery.length)
    );
    return includesMatches[0];
  }
  
  // No match found
  return null;
}

// Helper function to find the best property match
export const findBestPropertyMatch = (propertyName: string, properties: Property[]): Property | null => {
  return findBestMatch(propertyName, properties, (p) => p.name);
};

// Helper function to find matching POIs
export const findMatchingPOIs = (poiType: string, pois: POI[]): POI[] => {
  const normalizedType = poiType.toLowerCase();
  return pois.filter(poi => 
    poi.type.toLowerCase().includes(normalizedType) || 
    poi.name.toLowerCase().includes(normalizedType)
  );
};

// Helper function to normalize shipping service names for better matching
export const normalizeShippingService = (query: string): string => {
  // Handle common misspellings and variations of shipping services
  if (query.includes('fedex') || query.includes('fed ex') || query.includes('federal express')) {
    return 'fedex';
  }
  if (query.includes('ups') || query.includes('u.p.s.') || query.includes('united parcel')) {
    return 'ups';
  }
  if (query.includes('usps') || query.includes('u.s.p.s.') || query.includes('postal service')) {
    return 'usps';
  }
  if (query.includes('dhl')) {
    return 'dhl';
  }
  return query;
};

// Extract potential POI types from a query
export const extractPOITypes = (query: string): string[] => {
  const poiKeywords = [
    'restaurant', 'cafe', 'coffee', 'starbucks', 
    'food', 'grocery', 'supermarket', 'market',
    'fedex', 'ups', 'usps', 'shipping', 'postal',
    'gym', 'fitness', 'park', 'school', 'university',
    'bank', 'atm', 'gas', 'station', 'airport',
    'hotel', 'hospital', 'pharmacy', 'drugstore',
    'mall', 'shopping'
  ];
  
  return poiKeywords.filter(keyword => query.includes(keyword));
};
