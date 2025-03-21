
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/utils/data';

interface PropertyPopupProps {
  property: Property;
  map: mapboxgl.Map;
}

const PropertyPopup = ({ property, map }: PropertyPopupProps) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  useEffect(() => {
    if (!map || !property) return;
    
    const propertyCardContainer = document.createElement('div');
    propertyCardContainer.className = 'w-64';
    
    propertyCardContainer.innerHTML = `
      <div class="relative overflow-hidden">
        <img 
          src="${property.image}" 
          alt="${property.name}" 
          class="w-full h-28 object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      <div class="p-3 space-y-2">
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-medium line-clamp-1">
              ${property.name}
            </h3>
            <span class="text-xs px-1.5 py-0 bg-slate-100 text-slate-800 rounded-full">
              ${property.type}
            </span>
          </div>
          
          <div class="flex items-center text-gray-500 gap-1 mt-1">
            <span class="truncate text-xs">${property.address}</span>
          </div>
        </div>
        
        <div class="flex justify-between items-center text-xs">
          <div>
            <p class="font-medium">$${(property.price).toLocaleString()}</p>
            <p class="text-gray-500">Price</p>
          </div>
          
          <div>
            <p class="font-medium">${(property.size).toLocaleString()} sq ft</p>
            <p class="text-gray-500">Size</p>
          </div>
          
          <div>
            <p class="font-medium">${property.year}</p>
            <p class="text-gray-500">Year</p>
          </div>
        </div>
      </div>
    `;
    
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px',
      anchor: 'bottom'
    })
      .setLngLat([property.longitude, property.latitude])
      .setDOMContent(propertyCardContainer)
      .addTo(map);
    
    map.flyTo({
      center: [property.longitude, property.latitude],
      zoom: 15,
      duration: 1500
    });
    
    popupRef.current = popup;
    
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [property, map]);
  
  return null;
};

export default PropertyPopup;
