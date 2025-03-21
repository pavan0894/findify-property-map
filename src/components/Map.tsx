
import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property, POI } from '@/utils/data';
import { MAPBOX_TOKEN, fitMapToProperties, findPOIsNearProperty } from '@/utils/mapUtils';
import MapTokenInput from '@/components/MapTokenInput';
import MapInitializer from '@/components/map/MapInitializer';
import MapMarker from '@/components/map/MapMarker';
import PropertyPopup from '@/components/map/PropertyPopup';
import MapControls from '@/components/map/MapControls';
import POIMarker from '@/components/map/POIMarker';
import MapStyleSelector from '@/components/map/MapStyleSelector';

export interface MapProps {
  properties: Property[];
  filteredProperties: Property[];
  pointsOfInterest: POI[];
  selectedPOI: POI | null;
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  maxDistance: number;
}

export interface MapRef {
  clearPOIs: () => void;
  showPOIs: (pois: POI[]) => void;
}

const Map = forwardRef<MapRef, MapProps>(({
  properties,
  filteredProperties,
  pointsOfInterest,
  selectedPOI,
  selectedProperty,
  onSelectProperty,
  maxDistance
}: MapProps, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapToken] = useState<string>(MAPBOX_TOKEN);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activePOIs, setActivePOIs] = useState<POI[]>([]);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>('mapbox://styles/mapbox/light-v11');
  const [is3DEnabled, setIs3DEnabled] = useState<boolean>(true);

  const handleMapReady = useCallback((mapInstance: mapboxgl.Map) => {
    console.log('Map is now ready and loaded');
    setMap(mapInstance);
    setMapLoaded(true);
    setMapError(null);
  }, []);

  const handleMapError = useCallback((error: string) => {
    console.error('Map initialization error:', error);
    setMapError(error);
  }, []);

  const handleResetView = useCallback(() => {
    if (!map) return;
    fitMapToProperties(map, properties);
  }, [map, properties]);

  const handleToggle3D = useCallback(() => {
    if (!map) return;
    
    setIs3DEnabled(prev => {
      const newValue = !prev;
      
      if (newValue) {
        // Enable 3D view
        map.easeTo({
          pitch: 45,
          duration: 1000
        });
      } else {
        // Disable 3D view
        map.easeTo({
          pitch: 0,
          duration: 1000
        });
      }
      
      return newValue;
    });
  }, [map]);

  const handleStyleChange = useCallback((style: string) => {
    if (!map) return;
    console.log('Changing map style to:', style);
    setCurrentMapStyle(style);
    
    // Clear previous event listeners to prevent duplicates
    map.off('style.load');
    
    // Apply new style with the correct options according to MapboxGL types
    map.setStyle(style, { diff: false });
    
    // Re-add event listeners after style change
    map.on('style.load', () => {
      console.log('Style loaded successfully:', map.getStyle().name);
      
      // Only add 3D buildings if not in satellite mode
      if (!map.getStyle().name.includes('Satellite') && !map.getLayer('3d-buildings')) {
        map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              16, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              16, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      }
    });
  }, [map]);

  // Ensure map and properties are stable before rendering markers
  const stableProperties = useRef(properties);
  
  useEffect(() => {
    stableProperties.current = properties;
  }, [properties]);

  // When selectedPOI changes, add it to activePOIs if it's not already there
  useEffect(() => {
    if (selectedPOI && !activePOIs.some(poi => poi.id === selectedPOI.id)) {
      setActivePOIs(prev => [...prev, selectedPOI]);
    }
  }, [selectedPOI]);

  // When selectedProperty changes, show nearby POIs
  useEffect(() => {
    if (selectedProperty && map) {
      // Find POIs near this property
      const nearbyPOIs = findPOIsNearProperty(
        pointsOfInterest,
        selectedProperty,
        maxDistance * 1.60934 // Convert miles to km
      );
      
      // Update active POIs
      setActivePOIs(nearbyPOIs);
      
      console.log(`Found ${nearbyPOIs.length} POIs near selected property`);
    }
  }, [selectedProperty, pointsOfInterest, maxDistance, map]);

  // Debug information
  useEffect(() => {
    if (mapLoaded && map) {
      console.log(`Map loaded with ${properties.length} total properties, ${filteredProperties.length} filtered properties, and ${activePOIs.length} active POIs`);
    }
  }, [mapLoaded, map, properties.length, filteredProperties.length, activePOIs.length]);

  // Method to clear POIs
  const clearPOIs = useCallback(() => {
    setActivePOIs([]);
  }, []);

  // Method to set specific POIs
  const showPOIs = useCallback((pois: POI[]) => {
    setActivePOIs(pois);
  }, []);

  // Make these methods available through the component ref
  useImperativeHandle(ref, () => ({
    clearPOIs,
    showPOIs
  }), [clearPOIs, showPOIs]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 bg-gray-100" />
      
      <MapInitializer
        mapToken={mapToken}
        properties={properties}
        mapContainer={mapContainer}
        onMapReady={handleMapReady}
        onMapError={handleMapError}
        initialMapStyle={currentMapStyle}
      />
      
      {mapLoaded && map && (
        <>
          {properties.map(property => (
            <MapMarker
              key={property.id}
              property={property}
              map={map}
              isFiltered={filteredProperties.some(fp => fp.id === property.id)}
              onSelectProperty={onSelectProperty}
            />
          ))}
          
          {activePOIs.map(poi => (
            <POIMarker
              key={poi.id}
              poi={poi}
              map={map}
              isSelected={selectedPOI?.id === poi.id}
            />
          ))}
          
          {selectedProperty && (
            <PropertyPopup
              property={selectedProperty}
              map={map}
            />
          )}
        </>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 p-6 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-red-500 mb-4">{mapError}</p>
            <MapTokenInput onTokenChange={() => {}} />
          </div>
        </div>
      )}
      
      <MapControls 
        onResetView={handleResetView} 
        onToggle3D={handleToggle3D}
        is3DEnabled={is3DEnabled}
      />
      
      {!mapError && (
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-3">
          <MapTokenInput onTokenChange={() => {}} />
          <MapStyleSelector 
            currentStyle={currentMapStyle} 
            onStyleChange={handleStyleChange} 
          />
        </div>
      )}
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
