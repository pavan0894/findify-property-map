import React, { useRef, useEffect, useState } from 'react';
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
  const [isAdded, setIsAdded] = useState(false);
  
  useEffect(() => {
    // Skip if map is not available
    if (!map) {
      console.log(`No map available for property ${property.id}`);
      return;
    }
    
    // Remove existing marker if any
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    
    const createMarker = () => {
      try {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'property-marker';
        
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
        
        // Create the marker and add it to the map
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom',
        }).setLngLat([property.longitude, property.latitude]);
        
        marker.addTo(map);
        
        // Add click event
        markerEl.addEventListener('click', () => {
          onSelectProperty(property);
        });
        
        markerRef.current = marker;
        setIsAdded(true);
        console.log(`✅ Marker added for property ${property.id} at [${property.longitude}, ${property.latitude}]`);
      } catch (error) {
        console.error('Error creating marker for property', property.id, error);
      }
    };
    
    // Create marker immediately if map is already loaded
    if (map.loaded()) {
      console.log(`Map is loaded, adding marker for property ${property.id}`);
      createMarker();
    } else {
      // Otherwise wait for map to load
      console.log(`Map not loaded yet, waiting for load event for property ${property.id}`);
      
      const onMapLoad = () => {
        console.log(`Map load event fired, now adding marker for property ${property.id}`);
        createMarker();
        map.off('load', onMapLoad);
      };
      
      map.on('load', onMapLoad);
    }
    
    // Cleanup
    return () => {
      if (markerRef.current) {
        console.log(`Removing marker for property ${property.id}`);
        markerRef.current.remove();
        markerRef.current = null;
        setIsAdded(false);
      }
    };
  }, [map, property, isFiltered, onSelectProperty]);

  // Update marker if isFiltered changes
  useEffect(() => {
    if (map && isAdded && markerRef.current) {
      // Simply recreate the marker if isFiltered changes
      markerRef.current.remove();
      markerRef.current = null;
      setIsAdded(false);
    }
  }, [isFiltered, map, isAdded]);
  
  return null;
};

export default MapMarker;
