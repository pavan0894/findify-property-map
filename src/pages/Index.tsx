
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { properties, pointsOfInterest, POI, Property } from '@/utils/data';
import MainLayout from '@/components/layout/MainLayout';
import Map, { MapRef } from '@/components/Map';
import MobileSearchOverlay from '@/components/search/MobileSearchOverlay';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyTable from '@/components/property/PropertyTable';
import SearchFilters from '@/components/SearchFilters';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Chatbot from '@/components/Chatbot';

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
  
  // Responsive layout based on screen size
  if (isMobile) {
    return (
      <MainLayout 
        properties={properties}
        pointsOfInterest={pointsOfInterest}
        onSelectProperty={handleSelectProperty}
        onSelectPOI={handleSelectPOI}
        onShowPOIs={handleShowPOIs}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <SearchFilters />
          </div>

          <div className="h-[70vh] relative">
            <MobileSearchOverlay />
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
          
          <div className="flex-1 overflow-auto p-4">
            <PropertyTable
              properties={properties}
              onSelectProperty={handleSelectProperty}
              selectedProperty={selectedProperty}
            />
          </div>
        </div>
        
        <PropertyDetails
          property={selectedProperty}
          onClose={handleClosePropertyDetails}
          allPOIs={pointsOfInterest}
          onSelectPOI={handleSelectPOI}
          isOpen={showPropertyDetails}
        />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout 
      properties={properties}
      pointsOfInterest={pointsOfInterest}
      onSelectProperty={handleSelectProperty}
      onSelectPOI={handleSelectPOI}
      onShowPOIs={handleShowPOIs}
    >
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-4">
          <SearchFilters />
        </div>

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Chat Panel */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="h-full">
              <div className="h-full bg-background border-r p-0">
                <Chatbot
                  properties={properties}
                  pois={pointsOfInterest}
                  onSelectProperty={handleSelectProperty}
                  onSelectPOI={handleSelectPOI}
                  onShowPOIs={handleShowPOIs}
                  embedded={true}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Map and Table Panel */}
            <ResizablePanel defaultSize={75} className="h-full">
              <ResizablePanelGroup direction="vertical" className="h-full">
                {/* Map */}
                <ResizablePanel defaultSize={60} className="h-full">
                  <div className="relative h-full">
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
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Property Table */}
                <ResizablePanel defaultSize={40}>
                  <div className="h-full overflow-auto p-4">
                    <PropertyTable
                      properties={properties}
                      onSelectProperty={handleSelectProperty}
                      selectedProperty={selectedProperty}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      
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
