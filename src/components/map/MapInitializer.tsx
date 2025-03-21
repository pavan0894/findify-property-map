
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
  initialMapStyle: string;
}

const MapInitializer = ({ 
  mapToken, 
  properties, 
  mapContainer, 
  onMapReady, 
  onMapError,
  initialMapStyle
}: MapInitializerProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Only initialize once, and only if we have a container and token
    if (!mapContainer.current || mapRef.current || isInitialized || !mapToken) return;

    try {
      console.log('Initializing map with token:', mapToken);
      console.log('Initial map style:', initialMapStyle);
      
      // Set Mapbox token
      mapboxgl.accessToken = mapToken;
      
      // Calculate initial center
      const initialCenter = calculateCenter(properties);
      
      // Create new map instance
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: initialMapStyle,
        center: initialCenter,
        zoom: 10,
        pitch: 45, // Enable 3D view with pitch
        bearing: 0,
        attributionControl: false,
        renderWorldCopies: true,
        antialias: true // Enable antialiasing for smoother rendering
      });
      
      mapRef.current = mapInstance;
      
      // Add controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mapInstance.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

      // Add 3D buildings layer when style is loaded
      mapInstance.on('style.load', () => {
        console.log('Map style loaded:', mapInstance.getStyle().name);
        
        // Only add 3D buildings if we're not in satellite mode
        if (!mapInstance.getStyle().name.includes('Satellite') && !mapInstance.getLayer('3d-buildings')) {
          mapInstance.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                16, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                16, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          });
        }
      });

      // Wait for map to be fully loaded before notifying
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        setIsInitialized(true);
        onMapReady(mapInstance);
        
        // Fit map to properties only after it's fully loaded
        setTimeout(() => {
          if (properties.length > 0) {
            console.log(`Fitting map to ${properties.length} properties`);
            fitMapToProperties(mapInstance, properties);
          }
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
  }, [mapToken, properties, mapContainer, onMapReady, onMapError, initialMapStyle]);
  
  return null;
};

export default MapInitializer;
