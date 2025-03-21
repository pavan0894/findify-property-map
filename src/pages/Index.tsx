
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { properties, pointsOfInterest, POI, Property } from '@/utils/data';
import { filterPropertiesByPOIDistance, MAPBOX_TOKEN } from '@/utils/mapUtils';
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from '@/components/Navbar';
import Map, { MapRef } from '@/components/Map';
import SearchFilters from '@/components/SearchFilters';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetails from '@/components/PropertyDetails';
import Chatbot from '@/components/Chatbot';

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <main className="flex-1 flex flex-col pt-16">
        <div className="flex-1 flex relative">
          {/* Mobile Sidebar */}
          {isMobile && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetContent side="left" className="w-80 p-0 pt-4">
                <div className="p-4">
                  <SearchFilters
                    poiTypes={poiTypes}
                    selectedPOITypes={selectedPOITypes}
                    setSelectedPOITypes={setSelectedPOITypes}
                    maxDistance={maxDistance}
                    setMaxDistance={setMaxDistance}
                    onSearch={handleSearch}
                  />
                </div>
                
                <Separator />
                
                <ScrollArea className="h-[calc(100vh-230px)]">
                  <div className="p-4 grid gap-4">
                    {filteredProperties.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No properties found matching your criteria.</p>
                      </div>
                    ) : (
                      filteredProperties.map(property => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          compact
                          onClick={() => handleSelectProperty(property)}
                          selected={selectedProperty?.id === property.id}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col h-[calc(100vh-64px)]`}>
              <div className="p-6">
                <SearchFilters
                  poiTypes={poiTypes}
                  selectedPOITypes={selectedPOITypes}
                  setSelectedPOITypes={setSelectedPOITypes}
                  maxDistance={maxDistance}
                  setMaxDistance={setMaxDistance}
                  onSearch={handleSearch}
                />
              </div>
              
              <Separator />
              
              <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full">
                  <div className="p-6 grid gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">
                        {filteredProperties.length} Properties
                      </h2>
                    </div>
                    
                    {filteredProperties.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No properties found matching your criteria.</p>
                      </div>
                    ) : (
                      filteredProperties.map(property => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          onClick={() => handleSelectProperty(property)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          
          {/* Mobile Search Overlay */}
          {isMobile && (
            <div className="absolute top-3 left-3 right-3 z-10">
              <SearchFilters
                poiTypes={poiTypes}
                selectedPOITypes={selectedPOITypes}
                setSelectedPOITypes={setSelectedPOITypes}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
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
      </main>
      
      {/* Property Details Modal */}
      <PropertyDetails
        property={selectedProperty}
        onClose={handleClosePropertyDetails}
        allPOIs={pointsOfInterest}
        onSelectPOI={handleSelectPOI}
        isOpen={showPropertyDetails}
      />
      
      {/* Chatbot */}
      <Chatbot
        properties={properties}
        pois={pointsOfInterest}
        onSelectProperty={handleSelectProperty}
        onSelectPOI={handleSelectPOI}
        onShowPOIs={handleShowPOIs}
      />
    </div>
  );
};

export default Index;
