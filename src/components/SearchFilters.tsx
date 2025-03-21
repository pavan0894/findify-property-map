import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Search, 
  Package,
  Box,
  PackageCheck,
  Plane,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchFiltersProps {
  poiTypes: string[];
  selectedPOITypes: string[];
  setSelectedPOITypes: (types: string[]) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  onSearch: (searchQuery: string) => void;
  className?: string;
}

interface POITypeOption {
  type: string;
  icon: any;
}

const poiTypeOptions: POITypeOption[] = [
  { type: 'FedEx', icon: Package },
  { type: 'UPS', icon: Box },
  { type: 'Shipping Center', icon: PackageCheck },
  { type: 'Airport', icon: Plane }
];

const SearchFilters = ({
  poiTypes,
  selectedPOITypes,
  setSelectedPOITypes,
  maxDistance,
  setMaxDistance,
  onSearch,
  className = ''
}: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isMobile = useIsMobile();

  const togglePOIType = (type: string) => {
    if (selectedPOITypes.includes(type)) {
      setSelectedPOITypes(selectedPOITypes.filter(t => t !== type));
    } else {
      setSelectedPOITypes([...selectedPOITypes, type]);
    }
  };

  const handleSearch = () => {
    onSearch(searchQuery);
    if (isMobile) {
      setIsPopoverOpen(false);
    }
  };

  const clearFilters = () => {
    setSelectedPOITypes([]);
    setMaxDistance(5);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const FiltersContent = () => (
    <div className="space-y-6 w-full animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Points of Interest</h3>
          {selectedPOITypes.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedPOITypes([])} 
              className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {poiTypeOptions.map((poiOption) => (
            <Button
              key={poiOption.type}
              variant={selectedPOITypes.includes(poiOption.type) ? "default" : "outline"}
              size="sm"
              onClick={() => togglePOIType(poiOption.type)}
              className={`justify-start gap-2 h-auto px-3 py-2 text-xs font-normal transition-all ${
                selectedPOITypes.includes(poiOption.type) 
                  ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" 
                  : "hover:bg-secondary/80"
              }`}
            >
              <poiOption.icon className="h-3.5 w-3.5" />
              {poiOption.type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Max Distance</h3>
          <span className="text-xs font-medium bg-secondary rounded-full px-2 py-0.5">
            {maxDistance} miles
          </span>
        </div>
        <Slider
          value={[maxDistance]}
          min={0.5}
          max={10}
          step={0.5}
          onValueChange={(values) => setMaxDistance(values[0])}
          className="py-1"
        />
      </div>

      <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
        <Button 
          onClick={handleSearch} 
          className="w-full rounded-full bg-primary hover:bg-primary/90"
        >
          Apply Filters
        </Button>
        {(selectedPOITypes.length > 0 || maxDistance !== 5) && (
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            className="w-full rounded-full"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-9 py-5 h-auto bg-background border border-input rounded-full"
          />
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-1.5 h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Sliders className="h-4 w-4" />
                {(selectedPOITypes.length > 0 || maxDistance !== 5) && (
                  <span className="absolute top-0 right-0.5 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
              <FiltersContent />
            </PopoverContent>
          </Popover>
        </div>
        
        {selectedPOITypes.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 animate-fade-in overflow-x-auto no-scrollbar">
            {selectedPOITypes.map(type => (
              <Badge 
                key={type} 
                variant="secondary"
                className="h-6 rounded-full px-2 py-0 flex items-center gap-1 text-xs bg-secondary/80"
              >
                {type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => togglePOIType(type)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-xl p-4 ${className} animate-fade-in`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 bg-white/50 border-input/50"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          className="rounded-full px-5"
        >
          Search
        </Button>
      </div>
      
      <FiltersContent />
    </div>
  );
};

export default SearchFilters;
