import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property, POI, getPoiIcon } from '@/utils/data';
import { MAPBOX_TOKEN, calculateCenter, fitMapToProperties, calculateDistance, kmToMiles } from '@/utils/mapUtils';
import { Button } from '@/components/ui/button';
import { X, MapPin, Warehouse } from 'lucide-react';
import PropertyCard from './PropertyCard';

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
  const poiMarkersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const circleRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

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

    // Add custom animations on load
    map.current.on('load', () => {
      setMapLoaded(true);
      fitMapToProperties(map.current!, properties);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once

  // Update markers when properties change - show ALL properties on the map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for ALL properties, not just filtered ones
    properties.forEach(property => {
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-container';
      markerEl.style.position = 'relative';
      
      const icon = document.createElement('div');
      
      // Check if this property is in the filtered list
      const isInFilteredList = filteredProperties.some(fp => fp.id === property.id);
      
      // Style based on whether it's in the filtered list
      if (isInFilteredList) {
        icon.className = 'flex items-center justify-center h-7 w-7 bg-primary text-white rounded-full shadow-md';
      } else {
        icon.className = 'flex items-center justify-center h-7 w-7 bg-gray-400 text-white rounded-full shadow-md opacity-50';
      }
      
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/></svg>';
      
      markerEl.appendChild(icon);
      
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center', // Keep center anchor for better stability
        pitchAlignment: 'map', // Keep pin aligned with map pitch
        rotationAlignment: 'map', // Keep pin aligned with map rotation
      })
        .setLngLat([property.longitude, property.latitude])
        .addTo(map.current!);
      
      // Add click handler
      marker.getElement().addEventListener('click', () => {
        onSelectProperty(property);
      });
      
      markersRef.current[property.id] = marker;
    });

  }, [properties, filteredProperties, onSelectProperty, mapLoaded]);

  // Handle POI markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear previous POI markers
    Object.values(poiMarkersRef.current).forEach(marker => marker.remove());
    poiMarkersRef.current = {};

    // Add markers for POIs
    pointsOfInterest.forEach(poi => {
      const markerEl = document.createElement('div');
      markerEl.className = 'marker-container';
      markerEl.style.position = 'relative';
      
      const icon = document.createElement('div');
      icon.className = 'flex items-center justify-center h-6 w-6 bg-white text-primary border border-primary/30 rounded-full shadow-md';
      
      // Add POI icon
      const IconComponent = getPoiIcon(poi.type);
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('width', '14');
      iconSvg.setAttribute('height', '14');
      iconSvg.setAttribute('viewBox', '0 0 24 24');
      iconSvg.setAttribute('fill', 'none');
      iconSvg.setAttribute('stroke', 'currentColor');
      iconSvg.setAttribute('stroke-width', '2');
      iconSvg.setAttribute('stroke-linecap', 'round');
      iconSvg.setAttribute('stroke-linejoin', 'round');
      
      // Create paths based on POI type
      if (poi.type === 'Coffee Shop') {
        iconSvg.innerHTML = '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>';
      } else if (poi.type === 'Shopping Center') {
        iconSvg.innerHTML = '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>';
      } else if (poi.type === 'Restaurant') {
        iconSvg.innerHTML = '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>';
      } else if (poi.type === 'Education') {
        iconSvg.innerHTML = '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>';
      } else if (poi.type === 'Government') {
        iconSvg.innerHTML = '<rect x="2" y="6" width="20" height="14" rx="2" /><path d="M12 4 2 6v2h20V6L12 4Z" /><path d="M15 14a3 3 0 1 0-3 3" />';
      } else if (poi.type === 'Office') {
        iconSvg.innerHTML = '<path d="M1 10c1.5 1.5 5.25 3 9 3s7.5-1.5 9-3"/><path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"/><rect width="16" height="5" x="4" y="19" rx="1"/>';
      } else if (poi.type === 'Business Park') {
        iconSvg.innerHTML = '<rect width="12" height="14" x="2" y="3" rx="2"/><path d="M14 9h8m-8 5h8m-8-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/>';
      } else if (poi.type === 'Transit Hub') {
        iconSvg.innerHTML = '<path d="M8 6v6"/><path d="m5 6 6 6"/><path d="M5 12h6"/><rect x="4" y="4" width="16" height="16" rx="2"/>';
      } else {
        // Default map pin
        iconSvg.innerHTML = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
      }
      
      icon.appendChild(iconSvg);
      markerEl.appendChild(icon);
      
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center', // Change from 'bottom' to 'center' for better stability
        pitchAlignment: 'map', // Keep pin aligned with map pitch
        rotationAlignment: 'map', // Keep pin aligned with map rotation
      })
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map.current!);
      
      poiMarkersRef.current[poi.id] = marker;
    });
  }, [pointsOfInterest, mapLoaded]);

  // Handle selected POI
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedPOI) return;

    // Remove previous circle layer if it exists
    if (circleRef.current && map.current.getLayer('proximity-circle')) {
      map.current.removeLayer('proximity-circle');
      map.current.removeSource('proximity-circle');
      circleRef.current = null;
    }

    // Add a circle around the selected POI
    const radiusKm = maxDistance * 1.60934; // Convert miles to km
    const center: [number, number] = [selectedPOI.longitude, selectedPOI.latitude];

    // Create a circle source
    if (map.current.loaded()) {
      try {
        map.current.addSource('proximity-circle', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: center
            }
          }
        });

        // Add a layer for the circle
        map.current.addLayer({
          id: 'proximity-circle',
          type: 'circle',
          source: 'proximity-circle',
          paint: {
            'circle-radius': {
              stops: [
                [0, 0],
                [20, radiusKm * 1000] // Convert km to meters
              ],
              base: 2
            },
            'circle-color': 'rgba(0, 119, 255, 0.1)',
            'circle-stroke-color': 'rgba(0, 119, 255, 0.5)',
            'circle-stroke-width': 1
          }
        });

        circleRef.current = true;
      } catch (err) {
        console.error("Error adding circle:", err);
      }
    }

    // Highlight the selected POI marker
    if (poiMarkersRef.current[selectedPOI.id]) {
      const markerEl = poiMarkersRef.current[selectedPOI.id].getElement();
      const markerIcon = markerEl.querySelector('div');
      
      if (markerIcon) {
        markerIcon.className = 'flex items-center justify-center h-8 w-8 bg-primary text-white rounded-full shadow-md animate-pulse';
      }
    }

    // Fly to the POI
    map.current.flyTo({
      center: center,
      zoom: 13,
      duration: 1500
    });

    return () => {
      // Reset POI marker style when selection changes
      if (selectedPOI && poiMarkersRef.current[selectedPOI.id]) {
        const markerEl = poiMarkersRef.current[selectedPOI.id].getElement();
        const markerIcon = markerEl.querySelector('div');
        
        if (markerIcon) {
          markerIcon.className = 'flex items-center justify-center h-6 w-6 bg-white text-primary border border-primary/30 rounded-full shadow-md';
        }
      }
    };
  }, [selectedPOI, maxDistance, mapLoaded]);

  // Handle selected property
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedProperty) return;

    // Highlight the selected property marker
    if (markersRef.current[selectedProperty.id]) {
      const marker = markersRef.current[selectedProperty.id];
      
      // Add a popup for the selected property
      const popupContent = document.createElement('div');
      popupContent.className = 'p-0';
      
      const propertyCardContainer = document.createElement('div');
      propertyCardContainer.className = 'w-64';
      
      // Render the PropertyCard as a string (simplified version)
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
      
      popupContent.appendChild(propertyCardContainer);
      
      // Create and add the popup
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      })
        .setLngLat([selectedProperty.longitude, selectedProperty.latitude])
        .setDOMContent(popupContent)
        .addTo(map.current);
      
      // Fly to the property
      map.current.flyTo({
        center: [selectedProperty.longitude, selectedProperty.latitude],
        zoom: 15,
        duration: 1500
      });
      
      // Close popup when property is deselected
      return () => {
        popup.remove();
      };
    }
  }, [selectedProperty, mapLoaded]);

  // Reset view button
  const handleResetView = () => {
    if (!map.current) return;
    
    fitMapToProperties(map.current, properties);
    
    // Remove the circle if it exists
    if (circleRef.current && map.current.getLayer('proximity-circle')) {
      map.current.removeLayer('proximity-circle');
      map.current.removeSource('proximity-circle');
      circleRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 bg-gray-100" />
      
      <Button
        size="sm"
        className="absolute top-3 left-3 z-10 bg-white text-gray-900 hover:bg-gray-100 shadow-md rounded-md gap-2"
        onClick={handleResetView}
      >
        <MapPin className="h-4 w-4" />
        Reset View
      </Button>
      
      {selectedPOI && (
        <div className="absolute top-3 right-3 z-10 glass-panel rounded-md p-3 max-w-xs animate-fade-in">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                {React.createElement(selectedPOI.icon, { className: "h-4 w-4 text-primary" })}
              </div>
              <div>
                <h3 className="font-medium text-sm">{selectedPOI.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedPOI.type}</p>
                <p className="text-xs mt-1">
                  Showing properties within {maxDistance} miles
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => {}} // This would call onClearSelectedPOI
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
