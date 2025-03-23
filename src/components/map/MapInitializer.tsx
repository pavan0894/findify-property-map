
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
    // Only initialize once, and only if we have a container and token
    if (!mapContainer.current || mapRef.current || isInitialized || !mapToken) return;

    try {
      console.log('Initializing map with token:', mapToken.substring(0, 8) + '...');
      
      // Set Mapbox token
      mapboxgl.accessToken = mapToken;
      
      // Calculate initial center
      const initialCenter = calculateCenter(properties);
      
      // Create new map instance with simple default style
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCenter,
        zoom: 10,
        attributionControl: false
      });
      
      mapRef.current = mapInstance;
      
      // Add basic controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mapInstance.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

      // Set up load handler
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        setIsInitialized(true);
        
        // Delay slightly to ensure map is fully ready
        setTimeout(() => {
          // Fit map to properties after it's fully loaded
          if (properties.length > 0) {
            console.log(`Fitting map to ${properties.length} properties`);
            fitMapToProperties(mapInstance, properties);
          }
          
          // Notify parent component that map is ready
          onMapReady(mapInstance);
        }, 100);
      });
      
      // Handle errors
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
        onMapError('Error loading map. Please check Mapbox API status.');
      });

      return () => {
        console.log('Cleaning up map instance');
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
  }, [mapToken, properties, mapContainer, onMapReady, onMapError]);
  
  return null;
};

export default MapInitializer;
