
import React from 'react';
import SearchFilters from '@/components/SearchFilters';

interface MobileSearchOverlayProps {
  poiTypes: string[];
  selectedPOITypes: string[];
  setSelectedPOITypes: React.Dispatch<React.SetStateAction<string[]>>;
  maxDistance: number;
  setMaxDistance: React.Dispatch<React.SetStateAction<number>>;
  onSearch: (query: string) => void;
}

const MobileSearchOverlay = ({
  poiTypes,
  selectedPOITypes,
  setSelectedPOITypes,
  maxDistance,
  setMaxDistance,
  onSearch
}: MobileSearchOverlayProps) => {
  return (
    <div className="absolute top-3 left-3 right-3 z-10">
      <SearchFilters
        poiTypes={poiTypes}
        selectedPOITypes={selectedPOITypes}
        setSelectedPOITypes={setSelectedPOITypes}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        onSearch={onSearch}
        className="w-full"
      />
    </div>
  );
};

export default MobileSearchOverlay;
