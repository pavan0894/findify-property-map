
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
  return properties.filter(property => {
    const distance = calculateDistance(
      property.latitude,
      property.longitude,
      poi.latitude,
      poi.longitude
    );
    return distance <= maxDistanceKm;
  });
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
  
  return pois.filter(poi => {
    const distance = calculateDistance(
      property.latitude,
      property.longitude,
      poi.latitude,
      poi.longitude
    );
    return distance <= maxDistanceKm;
  });
}

// Function to calculate the center point of an array of coordinates
export function calculateCenter(properties: Property[]): [number, number] {
  if (!properties.length) return [-96.7970, 32.7767]; // Default to Dallas area
  
  const sum = properties.reduce(
    (acc, property) => {
      return {
        lat: acc.lat + property.latitude,
        lng: acc.lng + property.longitude
      };
    },
    { lat: 0, lng: 0 }
  );
  
  return [sum.lng / properties.length, sum.lat / properties.length];
}

// Function to fit map bounds to the given properties
export function fitMapToProperties(map: mapboxgl.Map, properties: Property[]) {
  if (!properties.length) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  properties.forEach(property => {
    bounds.extend([property.longitude, property.latitude]);
  });
  
  map.fitBounds(bounds, {
    padding: 100, // Increased padding to ensure all markers are visible
    maxZoom: 11, // Lower maxZoom to ensure we don't zoom in too close
    duration: 1000 // Faster animation
  });
}

// Filter POIs by type - improved to handle logistics-specific POI types
export function filterPOIsByType(pois: POI[], types: string[]): POI[] {
  if (!types.length) return pois;
  
  // Improved case-insensitive filtering
  return pois.filter(poi => 
    types.some(type => 
      poi.type.toLowerCase() === type.toLowerCase() ||
      poi.name.toLowerCase().includes(type.toLowerCase())
    )
  );
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
  
  // Filter POIs by selected types
  const filteredPOIs = filterPOIsByType(pois, poiTypes);
  
  // Find properties that are within maxDistance of at least one of the filtered POIs
  return properties.filter(property => {
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
}

// Add a delay function for animations
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
