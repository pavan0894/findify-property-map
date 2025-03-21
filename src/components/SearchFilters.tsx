
import React, { useState } from 'react';
import { 
  Sliders, 
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchFiltersProps {
  className?: string;
}

const SearchFilters = ({
  className = ''
}: SearchFiltersProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isMobile = useIsMobile();

  const FiltersContent = () => (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Empty filters content now that Clear All button is removed */}
    </div>
  );

  if (isMobile) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className="relative flex items-center w-full">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-1.5 h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Sliders className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
              <FiltersContent />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-xl p-4 ${className} animate-fade-in`}>      
      <FiltersContent />
    </div>
  );
};

export default SearchFilters;
