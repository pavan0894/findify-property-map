
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { properties, pointsOfInterest, POI, Property } from '@/utils/data';
import { filterPropertiesByPOIDistance } from '@/utils/mapUtils';
import MainLayout from '@/components/layout/MainLayout';
import Map, { MapRef } from '@/components/Map';
import MobileSearchOverlay from '@/components/search/MobileSearchOverlay';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyTable from '@/components/property/PropertyTable';
import SearchFilters from '@/components/SearchFilters';

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedPOITypes, setSelectedPOITypes] = useState<string[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [maxDistance, setMaxDistance] = useState(5); // in miles
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [activePOIs, setActivePOIs] = useState<POI[]>([]);
  const mapRef = useRef<MapRef>(null);
  
  // Extract unique POI types
  const poiTypes = Array.from(new Set(pointsOfInterest.map(poi => poi.type)));
  
  // Filter properties based on search, POI types, and distance
  useEffect(() => {
    let result = [...properties];
    
    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        property => 
          property.name.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    // Filter by distance to selected POI types
    if (selectedPOITypes.length > 0) {
      result = filterPropertiesByPOIDistance(
        result,
        pointsOfInterest,
        selectedPOITypes,
        maxDistance * 1.60934 // Convert miles to km
      );
    }
    
    setFilteredProperties(result);
  }, [searchQuery, selectedPOITypes, maxDistance]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle property selection
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };
  
  // Handle POI selection
  const handleSelectPOI = (poi: POI) => {
    setSelectedPOI(poi);
    setSelectedPOITypes([poi.type]);
    setShowPropertyDetails(false);
  };
  
  // Show POIs on map (called from Chatbot)
  const handleShowPOIs = (pois: POI[]) => {
    setActivePOIs(pois);
  };
  
  // Close property details
  const handleClosePropertyDetails = () => {
    setShowPropertyDetails(false);
  };
  
  return (
    <MainLayout 
      properties={properties}
      pointsOfInterest={pointsOfInterest}
      onSelectProperty={handleSelectProperty}
      onSelectPOI={handleSelectPOI}
      onShowPOIs={handleShowPOIs}
    >
      <div className="flex flex-col h-full">
        {/* Top section with filters */}
        <div className="p-4 bg-gray-50">
          <SearchFilters
            poiTypes={poiTypes}
            selectedPOITypes={selectedPOITypes}
            setSelectedPOITypes={setSelectedPOITypes}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            onSearch={handleSearch}
          />
        </div>

        {/* Map container */}
        <div className="h-[50vh] relative">
          {/* Mobile Search Overlay */}
          {isMobile && (
            <MobileSearchOverlay
              poiTypes={poiTypes}
              selectedPOITypes={selectedPOITypes}
              setSelectedPOITypes={setSelectedPOITypes}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              onSearch={handleSearch}
            />
          )}
          
          {/* Map */}
          <Map
            properties={properties}
            filteredProperties={filteredProperties}
            pointsOfInterest={pointsOfInterest}
            selectedPOI={selectedPOI}
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
            maxDistance={maxDistance}
            ref={mapRef}
          />
        </div>
        
        {/* Table section */}
        <div className="flex-1 overflow-auto p-4">
          <PropertyTable
            properties={filteredProperties}
            onSelectProperty={handleSelectProperty}
            selectedProperty={selectedProperty}
          />
        </div>
      </div>
      
      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        onClose={handleClosePropertyDetails}
        allPOIs={pointsOfInterest}
        onSelectPOI={handleSelectPOI}
        isOpen={showPropertyDetails}
      />
    </MainLayout>
  );
};

export default Index;
