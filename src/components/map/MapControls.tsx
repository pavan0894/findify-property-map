
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { CBRE_GREEN } from '@/utils/mapUtils';

interface MapControlsProps {
  onResetView: () => void;
}

const MapControls = ({ onResetView }: MapControlsProps) => {
  return (
    <div className="absolute top-3 left-3 z-10">
      <Button
        size="sm"
        className="text-white hover:bg-opacity-90 shadow-md rounded-md gap-2"
        onClick={onResetView}
        style={{ backgroundColor: CBRE_GREEN }}
      >
        <MapPin className="h-4 w-4" />
        Reset View
      </Button>
    </div>
  );
};

export default MapControls;
