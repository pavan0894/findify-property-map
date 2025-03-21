
import React, { useState, useEffect } from 'react';
import { Property, POI, formatPrice, formatSize } from '@/utils/data';
import { calculateDistance, kmToMiles } from '@/utils/mapUtils';
import { 
  X, 
  Map, 
  DollarSign, 
  SquareCode, 
  CalendarDays, 
  MapPin, 
  Check,
  Navigation
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PropertyDetailsProps {
  property: Property | null;
  onClose: () => void;
  allPOIs: POI[];
  onSelectPOI: (poi: POI) => void;
  isOpen: boolean;
}

const PropertyDetails = ({ 
  property, 
  onClose, 
  allPOIs, 
  onSelectPOI, 
  isOpen 
}: PropertyDetailsProps) => {
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([]);
  
  useEffect(() => {
    if (property && allPOIs.length > 0) {
      // Find POIs within 5km of the property
      const poiNearby = findPOIsNearProperty(allPOIs, property, 5);
      setNearbyPOIs(poiNearby);
    }
  }, [property, allPOIs]);
  
  // Define the missing utility function locally
  const findPOIsNearProperty = (
    pois: POI[],
    property: Property,
    maxDistanceKm: number
  ): POI[] => {
    return pois.filter(poi => {
      const distance = calculateDistance(
        property.latitude,
        property.longitude,
        poi.latitude,
        poi.longitude
      );
      return distance <= maxDistanceKm;
    });
  };
  
  if (!property) return null;
  
  const handleSelectPOI = (poi: POI) => {
    onSelectPOI(poi);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-0 gap-0">
        <div className="relative">
          <img 
            src={property.image} 
            alt={property.name} 
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 text-white bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-6 py-5 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{property.name}</h2>
              <Badge variant="outline">{property.type}</Badge>
            </div>
            <div className="flex items-center text-muted-foreground gap-1.5 mt-1.5">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">{property.address}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary mb-1" />
              <p className="text-sm font-medium">{formatPrice(property.price)}</p>
              <p className="text-xs text-muted-foreground">Price</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
              <SquareCode className="h-5 w-5 text-primary mb-1" />
              <p className="text-sm font-medium">{formatSize(property.size)}</p>
              <p className="text-xs text-muted-foreground">Size</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary mb-1" />
              <p className="text-sm font-medium">{property.year}</p>
              <p className="text-xs text-muted-foreground">Year Built</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{property.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Nearby Points of Interest</h3>
            {nearbyPOIs.length > 0 ? (
              <div className="space-y-2">
                {nearbyPOIs.slice(0, 5).map((poi) => {
                  const distance = calculateDistance(
                    property.latitude,
                    property.longitude,
                    poi.latitude,
                    poi.longitude
                  );
                  const milesDistance = kmToMiles(distance).toFixed(1);
                  
                  return (
                    <div 
                      key={poi.id} 
                      className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => handleSelectPOI(poi)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                          <poi.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{poi.name}</p>
                          <p className="text-xs text-muted-foreground">{poi.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Navigation className="h-3 w-3" />
                        <span>{milesDistance} mi</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No points of interest found nearby.</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-1">
            <Button className="flex-1 rounded-full">Contact Agent</Button>
            <Button variant="outline" className="flex-1 rounded-full">Schedule Tour</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetails;
