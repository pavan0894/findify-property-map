
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { POI } from '@/utils/data';

interface POIMarkerProps {
  poi: POI;
  map: mapboxgl.Map;
  isSelected: boolean;
}

const POIMarker = ({ poi, map, isSelected }: POIMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  useEffect(() => {
    // Make sure map exists
    if (!map) {
      console.log('Map not available for POI marker', poi.id);
      return;
    }
    
    // If marker already exists, remove it first to prevent duplicates
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    
    // Wait for map to be fully loaded
    if (!map.loaded()) {
      console.log('Map not loaded yet for POI marker', poi.id);
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
        
        // Create pin element with Google Maps style
        const pinColor = getPinColor(poi.type);
        
        // Create the pin with smaller dimensions
        const pinEl = document.createElement('div');
        pinEl.className = 'relative';
        pinEl.innerHTML = `
          <div class="h-4 w-4 rounded-full shadow-md ${isSelected ? 'scale-110' : ''}" style="background-color: ${pinColor}"></div>
          <div class="h-1.5 w-1.5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
        `;
        
        markerEl.appendChild(pinEl);
        
        // Create popup with more detailed information
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          offset: [0, -5],
          className: 'poi-popup'
        }).setHTML(`
          <div class="p-3">
            <h3 class="font-medium text-base">${poi.name}</h3>
            <p class="text-sm text-gray-500 mt-1">${poi.type}</p>
            ${poi.hasOwnProperty('description') && poi.description ? `<p class="text-sm mt-2">${poi.description}</p>` : ''}
            <div class="text-xs text-gray-400 mt-2">
              Lat: ${poi.latitude.toFixed(5)}, Lng: ${poi.longitude.toFixed(5)}
            </div>
          </div>
        `);
        
        // Create the marker and add to map
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'center',
        }).setLngLat([poi.longitude, poi.latitude])
          .setPopup(popup);
        
        // Only add marker if map container exists
        if (map && map.getContainer()) {
          marker.addTo(map);
          
          // If selected, show popup by default
          if (isSelected) {
            marker.togglePopup();
            
            // Center map on this POI
            map.flyTo({
              center: [poi.longitude, poi.latitude],
              zoom: 14,
              duration: 1000
            });
          }
          
          markerRef.current = marker;
          popupRef.current = popup;
          console.log('POI marker added for', poi.name);
        } else {
          console.error('Map container not available for POI', poi.id);
        }
      } catch (error) {
        console.error('Error creating marker for POI', poi.id, error);
      }
    }
    
    // Helper function to get pin color based on POI type
    function getPinColor(type: string): string {
      const typeLC = type.toLowerCase();
      
      switch(true) {
        case poi.name.toLowerCase().includes('fedex'):
          return '#9b59b6'; // Purple
        case poi.name.toLowerCase().includes('ups'):
          return '#f39c12'; // Amber
        case typeLC === 'restaurant':
          return '#e74c3c'; // Red
        case typeLC === 'coffee shop':
          return '#8b4513'; // Brown
        case typeLC === 'airport':
          return '#3498db'; // Sky blue
        case typeLC === 'office' || typeLC === 'shipping':
          return '#7f8c8d'; // Gray
        default:
          return '#2980b9'; // Blue
      }
    }
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, poi, isSelected]);
  
  return null;
};

export default POIMarker;
