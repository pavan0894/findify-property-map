import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property, POI } from '@/utils/data';
import { MAPBOX_TOKEN, calculateCenter, fitMapToProperties, CBRE_GREEN } from '@/utils/mapUtils';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import MapTokenInput from '@/components/MapTokenInput';

interface MapProps {
  properties: Property[];
  filteredProperties: Property[];
  pointsOfInterest: POI[];
  selectedPOI: POI | null;
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  maxDistance: number;
}

const Map = ({
  properties,
  filteredProperties,
  pointsOfInterest,
  selectedPOI,
  selectedProperty,
  onSelectProperty,
  maxDistance
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapToken] = useState<string>(MAPBOX_TOKEN);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = mapToken;
      
      const initialCenter = calculateCenter(properties);
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: initialCenter,
        zoom: 10,
        pitch: 0,
        attributionControl: false,
        renderWorldCopies: false
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
        fitMapToProperties(map.current!, properties);
      });
      
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Error loading map. Please check Mapbox API status.');
      });

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map. Please check Mapbox API status.');
    }
  }, [mapToken, properties]); // Dependencies are mapToken and properties

  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log('Map not ready for markers', { mapRef: !!map.current, mapLoaded });
      return;
    }
    
    console.log('Updating markers', { 
      propertiesCount: properties.length, 
      filteredCount: filteredProperties.length 
    });
    
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    properties.forEach(property => {
      const markerEl = document.createElement('div');
      markerEl.className = 'flex items-center justify-center';
      
      const icon = document.createElement('div');
      
      const isInFilteredList = filteredProperties.some(fp => fp.id === property.id);
      
      if (isInFilteredList) {
        icon.className = 'h-8 w-8 text-white rounded-full shadow-lg flex items-center justify-center';
        icon.style.backgroundColor = CBRE_GREEN;
      } else {
        icon.className = 'h-8 w-8 text-white rounded-full shadow-md opacity-60 flex items-center justify-center';
        icon.style.backgroundColor = '#999999';
      }
      
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/></svg>';
      
      markerEl.appendChild(icon);
      
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current!);
      
      marker.getElement().addEventListener('click', () => {
        onSelectProperty(property);
      });
      
      markersRef.current[property.id] = marker;
    });

    console.log('Markers created:', Object.keys(markersRef.current).length);

  }, [properties, filteredProperties, onSelectProperty, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedProperty) return;

    if (markersRef.current[selectedProperty.id]) {
      const marker = markersRef.current[selectedProperty.id];
      
      const popupContent = document.createElement('div');
      popupContent.className = 'p-0';
      
      const propertyCardContainer = document.createElement('div');
      propertyCardContainer.className = 'w-64';
      
      propertyCardContainer.innerHTML = `
        <div class="relative overflow-hidden">
          <img 
            src="${selectedProperty.image}" 
            alt="${selectedProperty.name}" 
            class="w-full h-28 object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        
        <div class="p-3 space-y-2">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-medium line-clamp-1">
                ${selectedProperty.name}
              </h3>
              <span class="text-xs px-1.5 py-0 bg-slate-100 text-slate-800 rounded-full">
                ${selectedProperty.type}
              </span>
            </div>
            
            <div class="flex items-center text-gray-500 gap-1 mt-1">
              <span class="truncate text-xs">${selectedProperty.address}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center text-xs">
            <div>
              <p class="font-medium">$${(selectedProperty.price).toLocaleString()}</p>
              <p class="text-gray-500">Price</p>
            </div>
            
            <div>
              <p class="font-medium">${(selectedProperty.size).toLocaleString()} sq ft</p>
              <p class="text-gray-500">Size</p>
            </div>
            
            <div>
              <p class="font-medium">${selectedProperty.year}</p>
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
        .setLngLat([selectedProperty.longitude, selectedProperty.latitude])
        .setDOMContent(popupContent)
        .addTo(map.current);
      
      map.current.flyTo({
        center: [selectedProperty.longitude, selectedProperty.latitude],
        zoom: 15,
        duration: 1500
      });
      
      return () => {
        popup.remove();
      };
    }
  }, [selectedProperty, mapLoaded]);

  const handleResetView = () => {
    if (!map.current) return;
    
    fitMapToProperties(map.current, properties);
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 bg-gray-100" />
      
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 p-6 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-red-500 mb-4">{mapError}</p>
            <MapTokenInput onTokenChange={() => {}} />
          </div>
        </div>
      )}
      
      <Button
        size="sm"
        className="absolute top-3 left-3 z-10 text-white hover:bg-opacity-90 shadow-md rounded-md gap-2"
        onClick={handleResetView}
        style={{ backgroundColor: CBRE_GREEN }}
      >
        <MapPin className="h-4 w-4" />
        Reset View
      </Button>
      
      {!mapError && (
        <div className="absolute top-3 right-3 z-10 max-w-xs">
          <MapTokenInput onTokenChange={() => {}} />
        </div>
      )}
    </div>
  );
};

export default Map;
