
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cube, MapPin } from 'lucide-react';
import { CBRE_GREEN } from '@/utils/mapUtils';

interface MapControlsProps {
  onResetView: () => void;
  onToggle3D?: () => void;
  is3DEnabled?: boolean;
}

const MapControls = ({ onResetView, onToggle3D, is3DEnabled }: MapControlsProps) => {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <Button
        size="sm"
        className="text-white hover:bg-opacity-90 shadow-md rounded-md gap-2"
        onClick={onResetView}
        style={{ backgroundColor: CBRE_GREEN }}
      >
        <MapPin className="h-4 w-4" />
        Reset View
      </Button>
      
      {onToggle3D && (
        <Button
          size="sm"
          variant={is3DEnabled ? "default" : "outline"}
          className="gap-2 shadow-md"
          onClick={onToggle3D}
          style={{ backgroundColor: is3DEnabled ? CBRE_GREEN : 'white', color: is3DEnabled ? 'white' : CBRE_GREEN }}
        >
          <Cube className="h-4 w-4" />
          3D View
        </Button>
      )}
    </div>
  );
};

export default MapControls;
