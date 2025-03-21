import { Truck, Coffee, UtensilsCrossed, Building2, Plane, MapPin } from 'lucide-react';

// Define Property interface for real estate properties
export interface Property {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  size: number; // in sq ft
  year: number;
  type: string;
  features: string[];
  description: string;
  image: string;
}

// Define POI (Point of Interest) interface for surrounding amenities
export interface POI {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  icon: any;
  description?: string; // Optional description field
}

// Sample Property Data
export const properties: Property[] = [
  {
    id: '1',
    name: 'Luxury Villa with Ocean View',
    address: '123 Ocean View Dr, Malibu, CA 90265',
    latitude: 34.0395,
    longitude: -118.7835,
    price: 12500000,
    size: 6800,
    year: 2018,
    type: 'Villa',
    features: ['Ocean View', 'Private Beach Access', 'Infinity Pool', 'Home Theater', 'Smart Home System'],
    description: 'An exquisite villa offering breathtaking ocean views and luxurious amenities. Perfect for those seeking the ultimate in coastal living.',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '2',
    name: 'Modern Downtown Loft',
    address: '456 Main St, Unit 502, Los Angeles, CA 90012',
    latitude: 34.0522,
    longitude: -118.2437,
    price: 2750000,
    size: 2200,
    year: 2020,
    type: 'Loft',
    features: ['City Views', 'High Ceilings', 'Gourmet Kitchen', 'Fitness Center', '24/7 Security'],
    description: 'A stylish loft in the heart of downtown, featuring modern design and convenient access to city amenities.',
    image: 'https://images.unsplash.com/photo-1600585154524-164726a42c9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '3',
    name: 'Suburban Family Home',
    address: '789 Oak Ave, Pasadena, CA 91101',
    latitude: 34.1478,
    longitude: -118.1445,
    price: 1950000,
    size: 3500,
    year: 2015,
    type: 'House',
    features: ['Large Backyard', 'Swimming Pool', 'Three Car Garage', 'Top Rated Schools', 'Close to Parks'],
    description: 'A charming family home in a desirable suburban neighborhood, offering ample space and a family-friendly environment.',
    image: 'https://images.unsplash.com/photo-1572120360386-5069301035b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '4',
    name: 'Cozy Beach Cottage',
    address: '101 Beach Rd, Santa Monica, CA 90401',
    latitude: 34.0083,
    longitude: -118.4961,
    price: 3200000,
    size: 1800,
    year: 1950,
    type: 'Cottage',
    features: ['Steps to the Beach', 'Outdoor Patio', 'Fireplace', 'Updated Kitchen', 'Original Charm'],
    description: 'A delightful beach cottage with a cozy atmosphere, just steps away from the sandy shores of Santa Monica.',
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc9701bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '5',
    name: 'Hillside Estate with Vineyard',
    address: '222 Wine Country Ln, Napa, CA 94558',
    latitude: 38.2970,
    longitude: -122.2844,
    price: 8900000,
    size: 9200,
    year: 2005,
    type: 'Estate',
    features: ['Private Vineyard', 'Wine Cellar', 'Infinity Pool', 'Guest House', 'Panoramic Views'],
    description: 'A stunning hillside estate in the heart of wine country, complete with a private vineyard and luxurious amenities.',
    image: 'https://images.unsplash.com/photo-1613490495764-e9a966569ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '6',
    name: 'Spacious Ranch Home',
    address: '333 Country Rd, Dallas, TX 75201',
    latitude: 32.7767,
    longitude: -96.7970,
    price: 750000,
    size: 2800,
    year: 1980,
    type: 'House',
    features: ['Large Lot', 'Mature Trees', 'Updated Kitchen', 'Two Car Garage', 'Close to Schools'],
    description: 'A well-maintained ranch home with a spacious layout, perfect for families seeking comfort and convenience.',
    image: 'https://images.unsplash.com/photo-1556912271-5c469fc1ca29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '7',
    name: 'Charming Historic Townhouse',
    address: '444 Historic District, Boston, MA 02108',
    latitude: 42.3601,
    longitude: -71.0589,
    price: 4200000,
    size: 3800,
    year: 1890,
    type: 'Townhouse',
    features: ['Original Woodwork', 'Fireplaces', 'Courtyard', 'Walkable Neighborhood', 'Close to Shops'],
    description: 'A beautifully preserved historic townhouse in a vibrant neighborhood, offering a glimpse into the past with modern amenities.',
    image: 'https://images.unsplash.com/photo-1549294413-26f195200c1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '8',
    name: 'Waterfront Condo with Marina',
    address: '555 Marina Way, Miami, FL 33139',
    latitude: 25.7617,
    longitude: -80.1918,
    price: 5800000,
    size: 3100,
    year: 2010,
    type: 'Condo',
    features: ['Waterfront Views', 'Private Balcony', 'Marina Access', 'Swimming Pool', 'Fitness Center'],
    description: 'A luxurious waterfront condo with stunning views and direct access to a private marina, perfect for boating enthusiasts.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '9',
    name: 'Rustic Mountain Cabin',
    address: '666 Mountain High Rd, Aspen, CO 81611',
    latitude: 39.1911,
    longitude: -106.8175,
    price: 2100000,
    size: 2400,
    year: 1975,
    type: 'Cabin',
    features: ['Mountain Views', 'Fireplace', 'Hiking Trails', 'Skiing Access', 'Secluded Location'],
    description: 'A cozy mountain cabin nestled in the Rockies, offering a peaceful retreat and easy access to outdoor adventures.',
    image: 'https://images.unsplash.com/photo-1533613222423-c643082ca81a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '10',
    name: 'Contemporary Urban Apartment',
    address: '777 City Center Plaza, Chicago, IL 60601',
    latitude: 41.8781,
    longitude: -87.6298,
    price: 950000,
    size: 1100,
    year: 2012,
    type: 'Apartment',
    features: ['City Views', 'Modern Appliances', 'Fitness Center', 'Rooftop Terrace', 'Walk to Everything'],
    description: 'A sleek urban apartment in the heart of Chicago, offering modern living and convenient access to city amenities.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822a2e18f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  }
];

// Sample Points of Interest Data
export const pointsOfInterest: POI[] = [
  {
    id: 'poi-1',
    name: 'Central Park',
    type: 'Park',
    latitude: 40.785091,
    longitude: -73.968285,
    icon: MapPin,
    description: 'A large park in the middle of the city.'
  },
  {
    id: 'poi-2',
    name: 'LaGuardia Airport',
    type: 'Airport',
    latitude: 40.776939,
    longitude: -73.873757,
    icon: Plane,
    description: 'A major airport serving the New York City area.'
  },
  {
    id: 'poi-3',
    name: 'Starbucks',
    type: 'Coffee Shop',
    latitude: 40.758896,
    longitude: -73.985130,
    icon: Coffee,
    description: 'A popular coffee shop chain.'
  },
  {
    id: 'poi-4',
    name: 'The Smith',
    type: 'Restaurant',
    latitude: 40.742138,
    longitude: -73.989731,
    icon: UtensilsCrossed,
    description: 'An American restaurant.'
  },
  {
    id: 'poi-5',
    name: 'UPS Store',
    type: 'Shipping',
    latitude: 40.754936,
    longitude: -73.984062,
    icon: Truck,
    description: 'A shipping and mailing service.'
  },
  {
    id: 'poi-6',
    name: 'FedEx Office Print & Ship Center',
    type: 'Shipping',
    latitude: 40.758896,
    longitude: -73.985130,
    icon: Building2,
    description: 'A business supply store.'
  },
  {
    id: 'poi-7',
    name: 'Empire State Building',
    type: 'Landmark',
    latitude: 40.7484,
    longitude: -73.9857,
    icon: Building2,
    description: 'A 102-story skyscraper in Midtown Manhattan, New York City.'
  },
  {
    id: 'poi-8',
    name: 'Times Square',
    type: 'Landmark',
    latitude: 40.7589,
    longitude: -73.9851,
    icon: Building2,
    description: 'A major commercial intersection, tourist destination, entertainment center, and neighborhood in midtown Manhattan.'
  },
  {
    id: 'poi-9',
    name: 'Grand Central Terminal',
    type: 'Transportation',
    latitude: 40.7527,
    longitude: -73.9772,
    icon: Building2,
    description: 'A train terminal in Midtown Manhattan, New York City.'
  },
  {
    id: 'poi-10',
    name: 'Rockefeller Center',
    type: 'Landmark',
    latitude: 40.7587,
    longitude: -73.9787,
    icon: Building2,
    description: 'A large complex consisting of 19 high-rise commercial buildings covering 22 acres between 48th Street and 51st Street in New York City.'
  }
];

// Utility function to format price
export const formatPrice = (price: number) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
};

// Utility function to format size
export const formatSize = (size: number) => {
  return size.toLocaleString('en-US');
};
