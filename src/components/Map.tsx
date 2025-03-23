
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

  // Track property changes
  useEffect(() => {
    if (mapLoaded && map) {
      console.log(`Map loaded with ${properties.length} total properties and ${filteredProperties.length} filtered properties`);
    }
  }, [mapLoaded, map, properties.length, filteredProperties.length]);

  // Handle POIs for selected property
  useEffect(() => {
    if (selectedProperty && map) {
      const nearbyPOIs = findPOIsNearProperty(
        pointsOfInterest,
        selectedProperty,
        maxDistance * 1.60934
      );
      
      setActivePOIs(nearbyPOIs);
      console.log(`Found ${nearbyPOIs.length} POIs near selected property`);
    }
  }, [selectedProperty, pointsOfInterest, maxDistance, map]);

  // Handle selected POI
  useEffect(() => {
    if (selectedPOI && !activePOIs.some(poi => poi.id === selectedPOI.id)) {
      setActivePOIs(prev => [...prev, selectedPOI]);
    }
  }, [selectedPOI, activePOIs]);

  // Expose methods via ref
  const clearPOIs = useCallback(() => {
    setActivePOIs([]);
  }, []);

  const showPOIs = useCallback((pois: POI[]) => {
    setActivePOIs(pois);
  }, []);

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
      />
      
      {!mapError && (
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-3">
          <MapTokenInput onTokenChange={() => {}} />
        </div>
      )}
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
