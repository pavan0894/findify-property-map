
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/utils/data';
import { CBRE_GREEN } from '@/utils/mapUtils';

interface MapMarkerProps {
  property: Property;
  map: mapboxgl.Map;
  isFiltered: boolean;
  onSelectProperty: (property: Property) => void;
}

const MapMarker = ({ property, map, isFiltered, onSelectProperty }: MapMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  
  useEffect(() => {
    // Make sure map exists
    if (!map) {
      console.log('Map not available for marker', property.id);
      return;
    }
    
    // If marker already exists, remove it first to prevent duplicates
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    
    // Wait for map to be fully loaded
    if (!map.loaded()) {
      console.log('Map not loaded yet for marker', property.id);
      const onMapLoad = () => {
        createMarker();
        map.off('load', onMapLoad);
      };
      map.on('load', onMapLoad);
      return;
    }
    
    createMarker();
    
    function createMarker() {
      try {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'flex items-center justify-center';
        
        const icon = document.createElement('div');
        
        if (isFiltered) {
          icon.className = 'h-8 w-8 text-white rounded-full shadow-lg flex items-center justify-center';
          icon.style.backgroundColor = CBRE_GREEN;
        } else {
          icon.className = 'h-8 w-8 text-white rounded-full shadow-md opacity-60 flex items-center justify-center';
          icon.style.backgroundColor = '#999999';
        }
        
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/></svg>';
        
        markerEl.appendChild(icon);
        
        // Create the marker and add to map
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom',
        }).setLngLat([property.longitude, property.latitude]);
        
        // Only add marker if map container exists
        if (map && map.getContainer()) {
          marker.addTo(map);
          
          // Add click event
          marker.getElement().addEventListener('click', () => {
            onSelectProperty(property);
          });
          
          markerRef.current = marker;
          console.log('Marker added for property', property.id);
        } else {
          console.error('Map container not available for property', property.id);
        }
      } catch (error) {
        console.error('Error creating marker for property', property.id, error);
      }
    }
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, property, isFiltered, onSelectProperty]);
  
  return null;
};

export default MapMarker;
