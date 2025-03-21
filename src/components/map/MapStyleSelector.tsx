import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Map } from 'lucide-react';

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

const MapStyleSelector = ({ currentStyle, onStyleChange }: MapStyleSelectorProps) => {
  const mapStyles = [
    { 
      value: 'mapbox://styles/mapbox/streets-v12', 
      label: 'Streets', 
      icon: <Map className="h-4 w-4 mr-2" /> 
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-md p-2 z-20">
      <Select 
        value={currentStyle} 
        onValueChange={onStyleChange}
      >
        <SelectTrigger className="w-[180px] border-none bg-transparent">
          <SelectValue placeholder="Map Style" />
        </SelectTrigger>
        <SelectContent>
          {mapStyles.map(style => (
            <SelectItem 
              key={style.value} 
              value={style.value}
              className="flex items-center"
            >
              <div className="flex items-center">
                {style.icon}
                {style.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MapStyleSelector;
