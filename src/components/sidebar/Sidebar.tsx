
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Property } from '@/utils/data';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SearchFilters from '@/components/SearchFilters';
import PropertyList from '@/components/property/PropertyList';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  poiTypes: string[];
  selectedPOITypes: string[];
  setSelectedPOITypes: React.Dispatch<React.SetStateAction<string[]>>;
  maxDistance: number;
  setMaxDistance: React.Dispatch<React.SetStateAction<number>>;
  onSearch: (query: string) => void;
  filteredProperties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  poiTypes,
  selectedPOITypes,
  setSelectedPOITypes,
  maxDistance,
  setMaxDistance,
  onSearch,
  filteredProperties,
  selectedProperty,
  onSelectProperty
}: SidebarProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 pt-4">
          <div className="p-4">
            <SearchFilters
              poiTypes={poiTypes}
              selectedPOITypes={selectedPOITypes}
              setSelectedPOITypes={setSelectedPOITypes}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              onSearch={onSearch}
            />
          </div>
          
          <Separator />
          
          <ScrollArea className="h-[calc(100vh-230px)]">
            <PropertyList 
              properties={filteredProperties}
              onSelectProperty={onSelectProperty}
              selectedProperty={selectedProperty}
              compact
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col h-[calc(100vh-64px)]`}>
      <div className="p-6">
        <SearchFilters
          poiTypes={poiTypes}
          selectedPOITypes={selectedPOITypes}
          setSelectedPOITypes={setSelectedPOITypes}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          onSearch={onSearch}
        />
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <PropertyList 
            properties={filteredProperties}
            onSelectProperty={onSelectProperty}
            selectedProperty={selectedProperty}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
