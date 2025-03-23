
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
      setIsAdded(false);
    }
    
    const createMarker = () => {
      try {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'property-marker';
        
        // Create the pin element using a smaller Google Maps style pin
        const pinEl = document.createElement('div');
        
        if (isFiltered) {
          pinEl.className = 'flex items-center justify-center';
          pinEl.innerHTML = `
            <div class="relative">
              <div class="h-5 w-5 rounded-full shadow-md ${isFiltered ? 'bg-[#003f2d]' : 'bg-gray-500 opacity-60'}"></div>
              <div class="h-2 w-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
            </div>
          `;
        } else {
          pinEl.className = 'flex items-center justify-center';
          pinEl.innerHTML = `
            <div class="relative">
              <div class="h-4 w-4 rounded-full shadow-md bg-gray-500 opacity-60"></div>
              <div class="h-1.5 w-1.5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
            </div>
          `;
        }
        
        markerEl.appendChild(pinEl);
        
        // Create the marker and add it to the map
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'center',
        }).setLngLat([property.longitude, property.latitude]);
        
        // Add click event
        markerEl.addEventListener('click', () => {
          onSelectProperty(property);
        });
        
        // Add marker to map
        marker.addTo(map);
        markerRef.current = marker;
        setIsAdded(true);
        console.log(`✅ Marker added for property ${property.id} at [${property.longitude}, ${property.latitude}]`);
      } catch (error) {
        console.error('Error creating marker for property', property.id, error);
      }
    };
    
    // Force a slight delay before adding markers to ensure map is ready
    setTimeout(() => {
      createMarker();
    }, 300);
    
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
