
import React from 'react';
import SearchFilters from '@/components/SearchFilters';

interface MobileSearchOverlayProps {
  className?: string;
}

const MobileSearchOverlay = ({
  className
}: MobileSearchOverlayProps) => {
  return (
    <div className="absolute top-3 left-3 right-3 z-10">
      <SearchFilters
        className="w-full"
      />
    </div>
  );
};

export default MobileSearchOverlay;
