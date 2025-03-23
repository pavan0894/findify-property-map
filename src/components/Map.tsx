
import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property, POI } from '@/utils/data';
import { MAPBOX_TOKEN, fitMapToProperties, findPOIsNearProperty, findPropertiesWithNearestFedEx } from '@/utils/mapUtils';
import { toast } from '@/hooks/use-toast';
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
  showPropertiesNearFedEx: () => void;
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
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [propertiesHighlight, setPropertiesHighlight] = useState<Property[]>([]);
  
  // Track when map loads
  const handleMapReady = useCallback((mapInstance: mapboxgl.Map) => {
    console.log('Map is now ready and loaded');
    setMap(mapInstance);
    setMapLoaded(true);
    setMapError(null);
    
    // Add a small delay and then trigger a re-render to ensure markers are created
    setTimeout(() => {
      setRenderTrigger(prev => prev + 1);
    }, 500);
  }, []);

  const handleMapError = useCallback((error: string) => {
    console.error('Map initialization error:', error);
    setMapError(error);
  }, []);

  const handleResetView = useCallback(() => {
    if (!map) return;
    const propsToFit = propertiesHighlight.length > 0 ? propertiesHighlight : properties;
    fitMapToProperties(map, propsToFit);
  }, [map, properties, propertiesHighlight]);

  // Track property changes
  useEffect(() => {
    if (mapLoaded && map) {
      console.log(`Map loaded with ${properties.length} total properties and ${filteredProperties.length} filtered properties`);
      // Force re-render to ensure markers are created
      setRenderTrigger(prev => prev + 1);
    }
  }, [mapLoaded, map, properties.length, filteredProperties.length]);

  // Log marker creation status
  useEffect(() => {
    if (mapLoaded && map && properties.length > 0) {
      console.log(`Ready to create ${properties.length} markers for properties (render trigger: ${renderTrigger})`);
    }
  }, [mapLoaded, map, properties, renderTrigger]);

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
      
      // Ensure POIs are visible even if they were set before the map was fully loaded
      setTimeout(() => {
        setRenderTrigger(prev => prev + 1);
      }, 200);
    }
  }, [selectedProperty, pointsOfInterest, maxDistance, map]);

  // Handle selected POI
  useEffect(() => {
    if (selectedPOI && !activePOIs.some(poi => poi.id === selectedPOI.id)) {
      setActivePOIs(prev => [...prev, selectedPOI]);
      
      // Focus the map on the selected POI if map is available
      if (map && mapLoaded) {
        map.flyTo({
          center: [selectedPOI.longitude, selectedPOI.latitude],
          zoom: 14,
          duration: 1000
        });
      }
    }
  }, [selectedPOI, activePOIs, map, mapLoaded]);

  // Expose methods via ref
  const clearPOIs = useCallback(() => {
    setActivePOIs([]);
    setPropertiesHighlight([]);
  }, []);

  const showPOIs = useCallback((pois: POI[]) => {
    if (pois.length > 0) {
      console.log(`Showing ${pois.length} POIs on map`);
      setActivePOIs(pois);
      
      // If map is available, fit to include all POIs
      if (map && mapLoaded && pois.length > 0) {
        try {
          const bounds = new mapboxgl.LngLatBounds();
          
          // Add each POI to the bounds
          pois.forEach(poi => {
            bounds.extend([poi.longitude, poi.latitude]);
          });
          
          // Fit the map to the bounds with some padding
          map.fitBounds(bounds, {
            padding: 100,
            maxZoom: 13,
            duration: 1000
          });
          
          // Trigger a re-render to ensure markers are created
          setTimeout(() => {
            setRenderTrigger(prev => prev + 1);
          }, 200);
          
          toast({
            title: `Showing ${pois.length} locations`,
            description: `Map updated with locations`,
          });
        } catch (error) {
          console.error('Error fitting map to POIs:', error);
        }
      }
    }
  }, [map, mapLoaded]);

  // New method to show properties near FedEx locations
  const showPropertiesNearFedEx = useCallback(() => {
    if (!map || !mapLoaded || !pointsOfInterest || !properties) {
      console.log('Map or data not ready for FedEx search');
      return;
    }

    console.log('Finding properties near FedEx locations');
    
    // Use new utility function to find properties with nearest FedEx locations
    const { properties: nearFedExProps, fedexLocations } = findPropertiesWithNearestFedEx(
      properties,
      pointsOfInterest,
      maxDistance * 1.60934 // Convert miles to km
    );
    
    if (fedexLocations.length === 0) {
      toast({
        title: "No FedEx Locations Found",
        description: "We couldn't find any FedEx locations in the database.",
      });
      return;
    }
    
    console.log(`Found ${nearFedExProps.length} properties near ${fedexLocations.length} FedEx locations`);
    
    // Show FedEx locations on map
    setActivePOIs(fedexLocations);
    
    // Highlight properties near FedEx
    setPropertiesHighlight(nearFedExProps);
    
    // Fit map to include both properties and FedEx locations
    if (map && mapLoaded) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        
        // Add each property to the bounds
        nearFedExProps.forEach(prop => {
          bounds.extend([prop.longitude, prop.latitude]);
        });
        
        // Add each FedEx location to the bounds
        fedexLocations.forEach(fedex => {
          bounds.extend([fedex.longitude, fedex.latitude]);
        });
        
        // Fit the map to the bounds with some padding
        map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 11,
          duration: 1000
        });
        
        // Trigger a re-render
        setRenderTrigger(prev => prev + 1);
        
        toast({
          title: `Properties Near FedEx`,
          description: `Found ${nearFedExProps.length} properties near ${fedexLocations.length} FedEx locations`,
        });
      } catch (error) {
        console.error('Error fitting map to FedEx data:', error);
      }
    }
  }, [map, mapLoaded, pointsOfInterest, properties, maxDistance]);

  useImperativeHandle(ref, () => ({
    clearPOIs,
    showPOIs,
    showPropertiesNearFedEx
  }), [clearPOIs, showPOIs, showPropertiesNearFedEx]);

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
              key={`marker-${property.id}-${renderTrigger}`}
              property={property}
              map={map}
              isFiltered={filteredProperties.some(fp => fp.id === property.id) || 
                           propertiesHighlight.some(ph => ph.id === property.id)}
              onSelectProperty={onSelectProperty}
            />
          ))}
          
          {activePOIs.map(poi => (
            <POIMarker
              key={`poi-${poi.id}-${renderTrigger}`}
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
      
      {/* Add a "Find Near FedEx" button for quick access */}
      <div className="absolute bottom-20 right-3 z-10">
        <button
          onClick={showPropertiesNearFedEx}
          className="bg-[#9b59b6] text-white px-3 py-2 rounded-md shadow-md hover:bg-[#8e44ad] transition-colors flex items-center gap-1.5"
        >
          <span className="text-sm font-medium">Properties Near FedEx</span>
        </button>
      </div>
    </div>
  );
});

Map.displayName = 'Map';

export default Map;
