
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
    // Make sure map exists and is fully loaded
    if (!map) return;
    
    // If marker already exists, remove it first to prevent duplicates
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    
    // Only create marker when map is fully loaded
    if (!map.loaded()) {
      const onMapLoad = () => {
        createAndAddMarker();
        map.off('load', onMapLoad);
      };
      map.on('load', onMapLoad);
      return;
    }
    
    createAndAddMarker();
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
    
    function createAndAddMarker() {
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
        
        // Create the marker
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom',
        }).setLngLat([property.longitude, property.latitude]);
        
        // Check that map is valid before adding marker
        if (map && map.getContainer()) {
          marker.addTo(map);
          
          // Add click event
          marker.getElement().addEventListener('click', () => {
            onSelectProperty(property);
          });
          
          markerRef.current = marker;
        }
      } catch (error) {
        console.error('Error creating marker for property', property.id, error);
      }
    }
  }, [map, property, isFiltered, onSelectProperty]);
  
  return null;
};

export default MapMarker;
