
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { POI } from '@/utils/data';
import { Truck, Coffee, UtensilsCrossed, Building2, Plane, MapPin } from 'lucide-react';

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
          icon.className = 'h-8 w-8 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transform scale-110';
        } else {
          icon.className = 'h-8 w-8 bg-blue-400 text-white rounded-full shadow-md flex items-center justify-center';
        }
        
        // Different icons for different POI types
        let iconSvg = '';
        let backgroundClass = 'bg-blue-500';
        
        // Customize icon based on POI type or name
        switch(true) {
          case poi.name.toLowerCase().includes('fedex'):
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="4" y="7" rx="1"/><path d="M4 15h16"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M12 7v8"/><path d="M20 15v4"/><path d="M4 15v4"/></svg>';
            icon.className = icon.className.replace('bg-blue-400', 'bg-purple-600').replace('bg-blue-500', 'bg-purple-700');
            break;
          case poi.name.toLowerCase().includes('ups'):
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="4" y="7" rx="1"/><path d="M4 15h16"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M12 7v8"/><path d="M20 15v4"/><path d="M4 15v4"/></svg>';
            icon.className = icon.className.replace('bg-blue-400', 'bg-amber-600').replace('bg-blue-500', 'bg-amber-700');
            break;
          case poi.type.toLowerCase() === 'restaurant':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h18"/><path d="M6 18h12c.6 0 1-.4 1-1v-5h-14v5c0 .6.4 1 1 1z"/><path d="M12 6v2"/><path d="M15 9H9"/><path d="M19 9a7 7 0 0 0-14 0"/></svg>';
            icon.className = icon.className.replace('bg-blue-400', 'bg-red-500').replace('bg-blue-500', 'bg-red-600');
            break;
          case poi.type.toLowerCase() === 'coffee shop':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>';
            icon.className = icon.className.replace('bg-blue-400', 'bg-amber-800').replace('bg-blue-500', 'bg-amber-900');
            break;
          case poi.type.toLowerCase() === 'airport':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9.5 10.5L12 13l2.5-2.5"/><path d="M11.5 10.5V6"/><path d="M12.5 10.5V6"/></svg>';
            icon.className = icon.className.replace('bg-blue-400', 'bg-sky-500').replace('bg-blue-500', 'bg-sky-600');
            break;
          case poi.type.toLowerCase() === 'office' || poi.type.toLowerCase() === 'shipping':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16"/><path d="M4 14h16"/><path d="M9 18V6c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v12"/><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>';
            icon.className = icon.className.replace('bg-blue-400', 'bg-gray-600').replace('bg-blue-500', 'bg-gray-700');
            break;
          default:
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="5" x2="12" y2="3"/><line x1="17" y1="7" x2="19" y2="5"/><line x1="19" y1="12" x2="21" y2="12"/><line x1="17" y1="17" x2="19" y2="19"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="7" y1="17" x2="5" y2="19"/><line x1="5" y1="12" x2="3" y2="12"/><line x1="7" y1="7" x2="5" y2="5"/></svg>';
        }
        
        icon.innerHTML = iconSvg;
        
        markerEl.appendChild(icon);
        
        // Create popup with more detailed information
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          offset: [0, -10],
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
