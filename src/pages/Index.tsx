
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { properties, pointsOfInterest, POI, Property } from '@/utils/data';
import { filterPropertiesByPOIDistance } from '@/utils/mapUtils';
import MainLayout from '@/components/layout/MainLayout';
import Map, { MapRef } from '@/components/Map';
import Sidebar from '@/components/sidebar/Sidebar';
import MobileSearchOverlay from '@/components/search/MobileSearchOverlay';
import PropertyDetails from '@/components/PropertyDetails';

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
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
  
  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
      toggleSidebar={toggleSidebar} 
      sidebarOpen={sidebarOpen}
      properties={properties}
      pointsOfInterest={pointsOfInterest}
      onSelectProperty={handleSelectProperty}
      onSelectPOI={handleSelectPOI}
      onShowPOIs={handleShowPOIs}
    >
      <div className="flex-1 flex relative">
        {/* Sidebar Component */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          poiTypes={poiTypes}
          selectedPOITypes={selectedPOITypes}
          setSelectedPOITypes={setSelectedPOITypes}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          onSearch={handleSearch}
          filteredProperties={filteredProperties}
          selectedProperty={selectedProperty}
          onSelectProperty={handleSelectProperty}
        />
        
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
        <div className="flex-1 relative">
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
