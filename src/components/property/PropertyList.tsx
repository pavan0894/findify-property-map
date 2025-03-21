
import React from 'react';
import { Property } from '@/utils/data';
import { ScrollArea } from "@/components/ui/scroll-area";
import PropertyCard from '@/components/PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  selectedProperty: Property | null;
  compact?: boolean;
}

const PropertyList = ({ 
  properties,
  onSelectProperty, 
  selectedProperty,
  compact = false
}: PropertyListProps) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No properties found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className={`${compact ? 'p-4 grid gap-4' : 'p-6 grid gap-5'}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {properties.length} Properties
          </h2>
        </div>
      )}
      
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          onClick={() => onSelectProperty(property)}
          compact={compact}
          selected={selectedProperty?.id === property.id}
        />
      ))}
    </div>
  );
};

export default PropertyList;
