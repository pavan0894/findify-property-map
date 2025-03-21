
import React from 'react';
import { Property, formatPrice, formatSize } from '@/utils/data';
import { Map, DollarSign, SquareCode, CalendarDays, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
  selected?: boolean;
}

const PropertyCard = ({ 
  property, 
  onClick, 
  compact = false, 
  className = "",
  selected = false
}: PropertyCardProps) => {
  const CardContent = () => (
    <>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={property.image} 
          alt={property.name} 
          className={cn(
            "w-full object-cover transform transition-transform duration-500",
            compact ? "h-28" : "h-48",
            "hover:scale-105"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      <div className={`p-4 space-y-3 ${compact ? 'space-y-2' : ''}`}>
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>
              {property.name}
            </h3>
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {property.type}
            </Badge>
          </div>
          
          <div className="flex items-center text-muted-foreground gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            <p className={`truncate ${compact ? 'text-xs' : 'text-sm'}`}>{property.address}</p>
          </div>
        </div>
        
        <div className={`grid ${compact ? 'grid-cols-2 gap-1.5' : 'grid-cols-3 gap-2'}`}>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className={`font-medium leading-none ${compact ? 'text-xs' : 'text-sm'}`}>
                {formatPrice(property.price)}
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Price</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
              <SquareCode className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className={`font-medium leading-none ${compact ? 'text-xs' : 'text-sm'}`}>
                {formatSize(property.size)}
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Size</p>
            </div>
          </div>
          
          {!compact && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{property.year}</p>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">Year</p>
              </div>
            </div>
          )}
        </div>
        
        {!compact && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {property.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{property.features.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {!compact && (
          <div className="flex gap-2 pt-1">
            <Button 
              size="sm" 
              className="flex-1 rounded-full"
              onClick={onClick}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="rounded-full px-3"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
  
  if (compact) {
    return (
      <div 
        className={cn(
          "bg-card rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer hover:shadow-md",
          selected && "ring-2 ring-primary",
          className
        )}
        onClick={onClick}
      >
        <CardContent />
      </div>
    );
  }
  
  return (
    <div className={`bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all ${className} animate-fade-in`}>
      <CardContent />
    </div>
  );
};

export default PropertyCard;
