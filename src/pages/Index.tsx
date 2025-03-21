
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { properties, pointsOfInterest, POI, Property } from '@/utils/data';
import MainLayout from '@/components/layout/MainLayout';
import Map, { MapRef } from '@/components/Map';
import MobileSearchOverlay from '@/components/search/MobileSearchOverlay';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyTable from '@/components/property/PropertyTable';
import SearchFilters from '@/components/SearchFilters';

const Index = () => {
  const isMobile = useIsMobile();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [activePOIs, setActivePOIs] = useState<POI[]>([]);
  const mapRef = useRef<MapRef>(null);
  
  // Handle property selection
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };
  
  // Handle POI selection
  const handleSelectPOI = (poi: POI) => {
    setSelectedPOI(poi);
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
        {/* Removed the bg-gray-50 class to eliminate the white background */}
        <div className="p-4">
          <SearchFilters />
        </div>

        {/* Map container */}
        <div className="h-[50vh] relative">
          {/* Mobile Search Overlay */}
          {isMobile && (
            <MobileSearchOverlay />
          )}
          
          {/* Map */}
          <Map
            properties={properties}
            filteredProperties={properties}
            pointsOfInterest={pointsOfInterest}
            selectedPOI={selectedPOI}
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
            maxDistance={5}
            ref={mapRef}
          />
        </div>
        
        {/* Property Table section */}
        <div className="flex-1 overflow-auto p-4">
          <PropertyTable
            properties={properties}
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
