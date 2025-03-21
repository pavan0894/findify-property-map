
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
  
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    try {
      mapboxgl.accessToken = mapToken;
      
      const initialCenter = calculateCenter(properties);
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: initialCenter,
        zoom: 10,
        pitch: 0,
        attributionControl: false,
        renderWorldCopies: false
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mapRef.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

      mapRef.current.on('load', () => {
        console.log('Map loaded successfully');
        if (mapRef.current) {
          onMapReady(mapRef.current);
          fitMapToProperties(mapRef.current, properties);
        }
      });
      
      mapRef.current.on('error', (e) => {
        console.error('Map error:', e);
        onMapError('Error loading map. Please check Mapbox API status.');
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
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
