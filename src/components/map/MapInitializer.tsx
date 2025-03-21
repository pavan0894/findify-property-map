
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/utils/data';
import { calculateCenter, fitMapToProperties } from '@/utils/mapUtils';

interface MapInitializerProps {
  mapToken: string;
  properties: Property[];
  mapContainer: React.RefObject<HTMLDivElement>;
  onMapReady: (map: mapboxgl.Map) => void;
  onMapError: (error: string) => void;
}

const MapInitializer = ({ 
  mapToken, 
  properties, 
  mapContainer, 
  onMapReady, 
  onMapError 
}: MapInitializerProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || isInitialized) return;

    try {
      console.log('Initializing map with token:', mapToken);
      
      // Verify the mapContainer is ready
      if (!mapContainer.current) {
        console.error('Map container ref is not available yet');
        return;
      }
      
      // Set Mapbox token
      mapboxgl.accessToken = mapToken;
      
      // Calculate initial center
      const initialCenter = calculateCenter(properties);
      
      // Create new map instance
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: initialCenter,
        zoom: 10,
        pitch: 0,
        attributionControl: false,
        renderWorldCopies: false
      });
      
      mapRef.current = mapInstance;
      setIsInitialized(true);
      
      // Add controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mapInstance.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

      // Wait for map to be fully loaded
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        if (mapRef.current) {
          onMapReady(mapRef.current);
          fitMapToProperties(mapRef.current, properties);
        }
      });
      
      // Handle errors
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
        onMapError('Error loading map. Please check Mapbox API status.');
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          setIsInitialized(false);
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      onMapError('Error initializing map. Please check Mapbox API status.');
    }
  }, [mapToken, properties, mapContainer, onMapReady, onMapError, isInitialized]);
  
  return null;
};

export default MapInitializer;
