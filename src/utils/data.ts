
import { MapPin, Warehouse, Coffee, ShoppingBag, Utensils, GraduationCap, Landmark, Building2, Briefcase, Bus } from 'lucide-react';

export interface Property {
  id: string;
  name: string;
  type: string;
  address: string;
  price: number;
  size: number;
  year: number;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  features: string[];
}

export interface POI {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  icon: any;
}

// Generate realistic industrial warehouse properties
export const properties: Property[] = Array.from({ length: 50 }, (_, i) => {
  // Create base coordinates around a city center (NYC-like area)
  const baseLat = 40.7128 + (Math.random() - 0.5) * 0.2;
  const baseLng = -74.006 + (Math.random() - 0.5) * 0.2;
  
  const warehouseTypes = ['Distribution Center', 'Storage Facility', 'Manufacturing Plant', 'Logistics Hub', 'Cold Storage'];
  const features = [
    'Loading Docks', 'High Ceilings', '24/7 Security', 'HVAC System', 'Sprinkler System', 
    'Office Space', 'Ample Parking', 'Truck Court', 'Rail Access', 'Cross-Docking',
    'Climate Control', 'Heavy Power', 'Reinforced Flooring', 'Column Spacing', 'Fenced Yard'
  ];
  
  // Select 3-6 random features for each property
  const randomFeatures = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => 
    features[Math.floor(Math.random() * features.length)]
  );
  
  // Ensure no duplicate features
  const uniqueFeatures = [...new Set(randomFeatures)];
  
  return {
    id: `prop-${i + 1}`,
    name: `${warehouseTypes[Math.floor(Math.random() * warehouseTypes.length)]} ${i + 1}`,
    type: 'Industrial',
    address: `${1000 + Math.floor(Math.random() * 8000)} Industrial Parkway, Warehouse District`,
    price: Math.floor(50 + Math.random() * 150) * 10000,
    size: Math.floor(10 + Math.random() * 90) * 1000,
    year: Math.floor(1980 + Math.random() * 42),
    latitude: baseLat,
    longitude: baseLng,
    description: `Modern industrial facility with excellent access to major transportation routes. This property features ${uniqueFeatures.slice(0, 2).join(' and ')} with ample space for operations and expansion possibilities.`,
    image: `https://source.unsplash.com/collection/3573299/800x600?sig=${i}`,
    features: uniqueFeatures
  };
});

// Generate points of interest
const poiTypes = [
  { type: 'Coffee Shop', icon: Coffee },
  { type: 'Shopping Center', icon: ShoppingBag },
  { type: 'Restaurant', icon: Utensils },
  { type: 'Education', icon: GraduationCap },
  { type: 'Government', icon: Landmark },
  { type: 'Office', icon: Building2 },
  { type: 'Business Park', icon: Briefcase },
  { type: 'Transit Hub', icon: Bus }
];

export const pointsOfInterest: POI[] = Array.from({ length: 30 }, (_, i) => {
  // Create POIs in the same general area as the properties
  const baseLat = 40.7128 + (Math.random() - 0.5) * 0.25;
  const baseLng = -74.006 + (Math.random() - 0.5) * 0.25;
  
  const poiType = poiTypes[Math.floor(Math.random() * poiTypes.length)];
  
  return {
    id: `poi-${i + 1}`,
    name: `${poiType.type} ${i + 1}`,
    type: poiType.type,
    latitude: baseLat,
    longitude: baseLng,
    icon: poiType.icon
  };
});

// Helper function to get POI icon by type
export const getPoiIcon = (poiType: string) => {
  const foundType = poiTypes.find(type => type.type === poiType);
  return foundType ? foundType.icon : MapPin;
};

// Helper function to format price
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to format square footage
export const formatSize = (sqft: number) => {
  return `${(sqft).toLocaleString()} sq ft`;
};
