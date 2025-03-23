
import mapboxgl from 'mapbox-gl';
import { Property, POI } from './data';

// Update to use the provided Mapbox token
export const MAPBOX_TOKEN = 'pk.eyJ1IjoicGF2YW4wODk0IiwiYSI6ImNtOGpjOHAycDBtNWMya29wYTM2aG9jc2QifQ.up5b4_cPIF_zj6O2rPjgjA';

// Updated CBRE Green color
export const CBRE_GREEN = '#003f2d';

// Calculate distance between two points using the Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Convert km to miles
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

// Find properties within a certain distance of a point of interest
export function findPropertiesNearPOI(
  properties: Property[],
  poi: POI,
  maxDistanceKm: number
): Property[] {
  console.log(`Finding properties near POI: ${poi.name} within ${maxDistanceKm}km`);
  
  const nearbyProperties = properties.filter(property => {
    const distance = calculateDistance(
      property.latitude,
      property.longitude,
      poi.latitude,
      poi.longitude
    );
    return distance <= maxDistanceKm;
  });
  
  console.log(`Found ${nearbyProperties.length} properties near ${poi.name}`);
  return nearbyProperties;
}

// Find properties near any POI of a specific type
export function findPropertiesNearPOIType(
  properties: Property[],
  pois: POI[],
  poiType: string,
  maxDistanceKm: number
): Property[] {
  console.log(`Finding properties near POI type: ${poiType} within ${maxDistanceKm}km`);
  
  // First filter POIs by type
  const filteredPOIs = pois.filter(poi => 
    poi.type.toLowerCase().includes(poiType.toLowerCase()) || 
    poi.name.toLowerCase().includes(poiType.toLowerCase())
  );
  
  console.log(`Found ${filteredPOIs.length} POIs matching type: ${poiType}`);
  
  if (filteredPOIs.length === 0) {
    return [];
  }
  
  // Find properties near any of the filtered POIs
  const nearbyProperties = properties.filter(property => {
    return filteredPOIs.some(poi => {
      const distance = calculateDistance(
        property.latitude,
        property.longitude,
        poi.latitude,
        poi.longitude
      );
      return distance <= maxDistanceKm;
    });
  });
  
  console.log(`Found ${nearbyProperties.length} properties near ${poiType} locations`);
  return nearbyProperties;
}

// Find properties with nearest FedEx locations
export function findPropertiesWithNearestFedEx(
  properties: Property[],
  pois: POI[],
  maxDistanceKm: number = 8 // Default to 5 miles (~ 8km)
): { properties: Property[], fedexLocations: POI[] } {
  console.log(`Finding properties with nearest FedEx locations within ${maxDistanceKm}km`);
  
  // First find all FedEx locations
  const fedexLocations = pois.filter(poi => 
    poi.name.toLowerCase().includes('fedex') ||
    (poi.type.toLowerCase().includes('shipping') && poi.name.toLowerCase().includes('fedex'))
  );
  
  console.log(`Found ${fedexLocations.length} FedEx locations`);
  
  if (fedexLocations.length === 0) {
    return { properties: [], fedexLocations: [] };
  }
  
  // Find properties near any FedEx location
  const propertiesNearFedEx = findPropertiesNearPOIType(
    properties,
    pois,
    'fedex',
    maxDistanceKm
  );
  
  // Sort properties by their closest FedEx location
  const sortedProperties = propertiesNearFedEx.map(property => {
    // Find the closest FedEx location to this property
    const distances = fedexLocations.map(fedex => ({
      fedex,
      distance: calculateDistance(
        property.latitude,
        property.longitude,
        fedex.latitude,
        fedex.longitude
      )
    }));
    
    // Sort by distance and get the closest
    distances.sort((a, b) => a.distance - b.distance);
    const closestFedEx = distances[0];
    
    return {
      property,
      closestFedEx: closestFedEx.fedex,
      distance: closestFedEx.distance
    };
  });
  
  // Sort the properties by proximity to the nearest FedEx
  sortedProperties.sort((a, b) => a.distance - b.distance);
  
  // Return only the properties, but sorted by proximity to FedEx
  return { 
    properties: sortedProperties.map(item => item.property),
    fedexLocations 
  };
}

// Find POIs within a certain distance of a property
export function findPOIsNearProperty(
  pois: POI[],
  property: Property,
  maxDistanceKm: number
): POI[] {
  // Enhanced to handle case where no distance is specified
  if (!maxDistanceKm || maxDistanceKm <= 0) {
    maxDistanceKm = 8; // Default to 5 miles (8km) if no valid distance
  }
  
  console.log(`Finding POIs near property: ${property.name} within ${maxDistanceKm}km`);
  
  const nearbyPOIs = pois.filter(poi => {
    const distance = calculateDistance(
      property.latitude,
      property.longitude,
      poi.latitude,
      poi.longitude
    );
    return distance <= maxDistanceKm;
  });
  
  console.log(`Found ${nearbyPOIs.length} POIs near ${property.name}`);
  return nearbyPOIs;
}

// Function to calculate the center point of an array of coordinates
export function calculateCenter(properties: Property[]): [number, number] {
  if (!properties.length) return [-96.7970, 32.7767]; // Default to Dallas area
  
  // Log the properties to help with debugging
  console.log(`Calculating center for ${properties.length} properties`);
  
  const sum = properties.reduce(
    (acc, property) => {
      return {
        lat: acc.lat + property.latitude,
        lng: acc.lng + property.longitude
      };
    },
    { lat: 0, lng: 0 }
  );
  
  const center: [number, number] = [sum.lng / properties.length, sum.lat / properties.length];
  console.log('Calculated center:', center);
  return center;
}

// Function to fit map bounds to the given properties
export function fitMapToProperties(map: mapboxgl.Map, properties: Property[]) {
  if (!properties.length) {
    console.log('No properties to fit bounds to');
    return;
  }
  
  try {
    const bounds = new mapboxgl.LngLatBounds();
    
    console.log(`Fitting bounds to ${properties.length} properties`);
    
    // Add each property to the bounds
    properties.forEach(property => {
      bounds.extend([property.longitude, property.latitude]);
    });
    
    // Log the bounds
    console.log('Bounds:', bounds.toArray());
    
    // Fit the map to the bounds
    map.fitBounds(bounds, {
      padding: 100, // Increased padding to ensure all markers are visible
      maxZoom: 11, // Lower maxZoom to ensure we don't zoom in too close
      duration: 1000 // Faster animation
    });
    
    console.log('Map fitted to bounds');
  } catch (error) {
    console.error('Error fitting map to properties:', error);
  }
}

// Filter POIs by type - improved to handle logistics-specific POI types
export function filterPOIsByType(pois: POI[], types: string[]): POI[] {
  if (!types.length) return pois;
  
  console.log(`Filtering POIs by types: ${types.join(', ')}`);
  
  // Improved case-insensitive filtering
  const filteredPOIs = pois.filter(poi => 
    types.some(type => 
      poi.type.toLowerCase() === type.toLowerCase() ||
      poi.name.toLowerCase().includes(type.toLowerCase())
    )
  );
  
  console.log(`Filtered ${pois.length} POIs down to ${filteredPOIs.length} POIs`);
  return filteredPOIs;
}

// Filter properties by distance to POI types
export function filterPropertiesByPOIDistance(
  properties: Property[],
  pois: POI[],
  poiTypes: string[],
  maxDistanceKm: number
): Property[] {
  // If no POI types selected, return all properties
  if (!poiTypes.length) return properties;
  
  console.log(`Filtering properties by POI types: ${poiTypes.join(', ')} within ${maxDistanceKm}km`);
  
  // Filter POIs by selected types
  const filteredPOIs = filterPOIsByType(pois, poiTypes);
  
  // Find properties that are within maxDistance of at least one of the filtered POIs
  const filteredProperties = properties.filter(property => {
    return filteredPOIs.some(poi => {
      const distance = calculateDistance(
        property.latitude,
        property.longitude,
        poi.latitude,
        poi.longitude
      );
      return distance <= maxDistanceKm;
    });
  });
  
  console.log(`Filtered ${properties.length} properties down to ${filteredProperties.length} properties`);
  return filteredProperties;
}

// Add a delay function for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
