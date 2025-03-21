
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
        
        // Create icon with different appearance based on POI type
        const icon = document.createElement('div');
        
        if (isSelected) {
          icon.className = 'h-8 w-8 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center';
        } else {
          icon.className = 'h-8 w-8 bg-blue-400 text-white rounded-full shadow-md flex items-center justify-center';
        }
        
        // Different icons for different POI types
        let iconSvg = '';
        switch(poi.type.toLowerCase()) {
          case 'restaurant':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h18"/><path d="M6 18h12c.6 0 1-.4 1-1v-5h-14v5c0 .6.4 1 1 1z"/><path d="M12 6v2"/><path d="M15 9H9"/><path d="M19 9a7 7 0 0 0-14 0"/></svg>';
            break;
          case 'coffee shop':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>';
            break;
          case 'office':
          case 'shipping':
            if (poi.name.toLowerCase().includes('fedex')) {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16"/><path d="M4 14h16"/><path d="M9 18V6c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v12"/><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>';
            } else {
              iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M12 7h.01"/><path d="M17 7h.01"/><path d="M7 12h.01"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 17h.01"/><path d="M12 17h.01"/><path d="M17 17h.01"/></svg>';
            }
            break;
          default:
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="5" x2="12" y2="3"/><line x1="17" y1="7" x2="19" y2="5"/><line x1="19" y1="12" x2="21" y2="12"/><line x1="17" y1="17" x2="19" y2="19"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="7" y1="17" x2="5" y2="19"/><line x1="5" y1="12" x2="3" y2="12"/><line x1="7" y1="7" x2="5" y2="5"/></svg>';
        }
        
        icon.innerHTML = iconSvg;
        
        markerEl.appendChild(icon);
        
        // Create popup for the POI
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          offset: [0, -10],
          className: 'poi-popup'
        }).setHTML(`
          <div class="p-2">
            <p class="font-medium">${poi.name}</p>
            <p class="text-sm text-gray-500">${poi.type}</p>
          </div>
        `);
        
        // Create the marker and add to map
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom',
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
