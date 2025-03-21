
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

// Sample Property Data - 40 Industrial Properties in Dallas area managed by CBRE
export const properties: Property[] = [
  {
    id: '1',
    name: 'Dallas Logistics Hub',
    address: '4800 LBJ Freeway, Dallas, TX 75244',
    latitude: 32.9269,
    longitude: -96.8382,
    price: 7500000,
    size: 120000,
    year: 2015,
    type: 'Industrial',
    features: ['Loading Docks', 'High Ceiling', 'HVAC', 'Security System', 'Truck Court'],
    description: 'Modern logistics facility with excellent access to major highways and transportation networks.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '2',
    name: 'North Dallas Distribution Center',
    address: '2500 North Stemmons Freeway, Dallas, TX 75207',
    latitude: 32.7995,
    longitude: -96.8268,
    price: 9200000,
    size: 185000,
    year: 2018,
    type: 'Industrial',
    features: ['Cross-Dock', 'Sprinkler System', '30\' Clear Height', 'LED Lighting', 'Office Space'],
    description: 'State-of-the-art distribution center with cross-dock configuration and modern amenities.',
    image: 'https://images.unsplash.com/photo-1612630741022-b29ec17d013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '3',
    name: 'Arlington Industrial Park',
    address: '1200 E Division St, Arlington, TX 76011',
    latitude: 32.7378,
    longitude: -97.0642,
    price: 5700000,
    size: 92000,
    year: 2012,
    type: 'Industrial',
    features: ['Dock High Doors', 'Drive-In Doors', 'Clear Span', 'Outside Storage', 'Rail Served'],
    description: 'Versatile industrial park with rail access and flexible space configurations.',
    image: 'https://images.unsplash.com/photo-1565625446024-f558c0a96c3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kdXN0cmlhbCUyMGJ1aWxkaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '4',
    name: 'South Dallas Business Center',
    address: '5601 S Lamar St, Dallas, TX 75215',
    latitude: 32.7215,
    longitude: -96.7683,
    price: 4800000,
    size: 78000,
    year: 2010,
    type: 'Industrial',
    features: ['ESFR Sprinkler', 'Column Spacing', 'Truck Court', 'Secure Facility', 'Climate Control'],
    description: 'Well-maintained business center with climate-controlled spaces and secure facilities.',
    image: 'https://images.unsplash.com/photo-1594136462930-ed6723f4ab0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '5',
    name: 'Garland Manufacturing Complex',
    address: '2600 W Miller Rd, Garland, TX 75041',
    latitude: 32.8922,
    longitude: -96.6539,
    price: 12500000,
    size: 230000,
    year: 2016,
    type: 'Industrial',
    features: ['Heavy Power', 'Crane Ready', 'Industrial Zoning', 'Loading Bays', 'Large Yard'],
    description: 'Manufacturing facility with heavy power capacity and crane-ready infrastructure.',
    image: 'https://images.unsplash.com/photo-1563354736-29eb55f3a2c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '6',
    name: 'Irving Commerce Center',
    address: '5000 W Royal Ln, Irving, TX 75063',
    latitude: 32.9090,
    longitude: -96.9983,
    price: 8300000,
    size: 145000,
    year: 2017,
    type: 'Industrial',
    features: ['Office/Warehouse', 'Skylights', 'Fiber Optic', 'Dock Levelers', 'Parking'],
    description: 'Mixed-use commerce center featuring office and warehouse space with modern amenities.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '7',
    name: 'Mesquite Distribution Facility',
    address: '4250 US-80, Mesquite, TX 75150',
    latitude: 32.7789,
    longitude: -96.5975,
    price: 6100000,
    size: 104000,
    year: 2014,
    type: 'Industrial',
    features: ['Truck Wells', 'Oversized Doors', 'Security Cameras', 'Fenced Perimeter', 'Break Room'],
    description: 'Strategic distribution facility with easy access to major highways and transportation routes.',
    image: 'https://images.unsplash.com/photo-1638864616212-0b6ced8624b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '8',
    name: 'Plano Tech Industrial',
    address: '3000 Custer Rd, Plano, TX 75075',
    latitude: 33.0225,
    longitude: -96.7498,
    price: 8900000,
    size: 125000,
    year: 2019,
    type: 'Industrial',
    features: ['Data Center Ready', 'Backup Generators', 'Loading Docks', 'High Power', 'Fire Suppression'],
    description: 'High-tech industrial facility designed for technology companies with specialized infrastructure.',
    image: 'https://images.unsplash.com/photo-1631212522139-68e975ca798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZHVzdHJpYWwlMjBidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '9',
    name: 'Carrollton Flex Space',
    address: '1250 Valwood Pkwy, Carrollton, TX 75006',
    latitude: 32.9571,
    longitude: -96.9138,
    price: 4200000,
    size: 82000,
    year: 2013,
    type: 'Industrial',
    features: ['Flexible Units', 'Grade Level Doors', 'Ventilation', 'Showroom Option', 'Highway Access'],
    description: 'Flexible industrial space that can be configured for various business needs and operations.',
    image: 'https://images.unsplash.com/photo-1507142916758-6a2b8d5a86d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '10',
    name: 'Lewisville Warehouse',
    address: '800 E State Hwy 121, Lewisville, TX 75057',
    latitude: 33.0083,
    longitude: -96.9711,
    price: 5500000,
    size: 98000,
    year: 2015,
    type: 'Industrial',
    features: ['Dock High Doors', 'Clear Height', 'Concrete Tilt-Wall', 'Employee Parking', 'Office Space'],
    description: 'Modern warehouse facility with excellent logistics capabilities and strategic location.',
    image: 'https://images.unsplash.com/photo-1519214605650-76a613ee3245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '11',
    name: 'Richardson Tech Park',
    address: '1200 E Campbell Rd, Richardson, TX 75081',
    latitude: 32.9773,
    longitude: -96.7135,
    price: 7800000,
    size: 115000,
    year: 2016,
    type: 'Industrial',
    features: ['R&D Space', 'Clean Room', 'Loading Docks', 'Climate Control', 'Security System'],
    description: 'Industrial tech park designed for research and development with specialized facilities.',
    image: 'https://images.unsplash.com/photo-1545060894-7c27c302e7c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhcmVob3VzZSUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '12',
    name: 'Addison Business Center',
    address: '4545 Sigma Rd, Addison, TX 75001',
    latitude: 32.9665,
    longitude: -96.8312,
    price: 6700000,
    size: 108000,
    year: 2014,
    type: 'Industrial',
    features: ['Multi-Tenant', 'Dock Doors', 'Showroom Space', 'Conference Room', 'Build-to-Suit'],
    description: 'Multi-tenant business center with versatile spaces suitable for various industrial applications.',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '13',
    name: 'Farmers Branch Distribution',
    address: '2550 Valwood Pkwy, Farmers Branch, TX 75234',
    latitude: 32.9241,
    longitude: -96.9147,
    price: 8500000,
    size: 137000,
    year: 2017,
    type: 'Industrial',
    features: ['Distribution Center', 'Cross-Dock', 'Automated Systems', 'Truck Court', 'Security'],
    description: 'Advanced distribution center with automated systems and optimized logistics design.',
    image: 'https://images.unsplash.com/photo-1614059656463-78b7a0db4de7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhcmVob3VzZSUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '14',
    name: 'Grand Prairie Manufacturing',
    address: '2700 W Marshall Dr, Grand Prairie, TX 75051',
    latitude: 32.7468,
    longitude: -97.0419,
    price: 11200000,
    size: 210000,
    year: 2015,
    type: 'Industrial',
    features: ['Manufacturing Space', 'Heavy Power', 'Loading Docks', 'Overhead Cranes', 'Air Compressors'],
    description: 'Heavy manufacturing facility with specialized infrastructure for industrial production.',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdhcmVob3VzZSUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '15',
    name: 'Duncanville Business Park',
    address: '900 S Cedar Ridge Dr, Duncanville, TX 75137',
    latitude: 32.6339,
    longitude: -96.9276,
    price: 4700000,
    size: 85000,
    year: 2012,
    type: 'Industrial',
    features: ['Flex Space', 'Roll-Up Doors', 'Office Space', 'Storage', 'Parking'],
    description: 'Versatile business park with mixed-use spaces suitable for various industrial needs.',
    image: 'https://images.unsplash.com/photo-1417870839255-a23faa90c6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY3RvcnklMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '16',
    name: 'DeSoto Logistics Center',
    address: '1500 E Centre Park Blvd, DeSoto, TX 75115',
    latitude: 32.5843,
    longitude: -96.8482,
    price: 7300000,
    size: 128000,
    year: 2018,
    type: 'Industrial',
    features: ['Logistics Facility', 'ESFR Sprinkler', 'Multiple Docks', 'Trailer Storage', 'Security Gate'],
    description: 'Modern logistics center with comprehensive facilities for efficient distribution operations.',
    image: 'https://images.unsplash.com/photo-1527174744973-fc9ce02c4a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZhY3RvcnklMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '17',
    name: 'McKinney Industrial Complex',
    address: '3100 Redbud Blvd, McKinney, TX 75069',
    latitude: 33.1970,
    longitude: -96.6389,
    price: 6900000,
    size: 112000,
    year: 2016,
    type: 'Industrial',
    features: ['Industrial Units', 'Dock High', 'Office/Warehouse', 'High Ceilings', 'Power Supply'],
    description: 'Industrial complex with multiple units suitable for various business operations.',
    image: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFjdG9yeSUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '18',
    name: 'Allen Manufacturing Center',
    address: '1300 N Watters Rd, Allen, TX 75013',
    latitude: 33.1052,
    longitude: -96.6770,
    price: 7100000,
    size: 118000,
    year: 2015,
    type: 'Industrial',
    features: ['Manufacturing Facility', 'Assembly Lines', 'Loading Areas', 'Employee Facilities', 'Secure Access'],
    description: 'Purpose-built manufacturing center with efficient layout and employee amenities.',
    image: 'https://images.unsplash.com/photo-1627646795037-58c137a1ca7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFjdG9yeSUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '19',
    name: 'Frisco Business Center',
    address: '7000 Main St, Frisco, TX 75034',
    latitude: 33.1453,
    longitude: -96.8246,
    price: 8200000,
    size: 133000,
    year: 2017,
    type: 'Industrial',
    features: ['Mixed-Use', 'Office/Warehouse', 'Modern Design', 'Tech-Ready', 'Conference Facilities'],
    description: 'Modern business center with premium mixed-use spaces in a rapidly growing area.',
    image: 'https://images.unsplash.com/photo-1604754742629-3e0498a8232a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGlzdHJpYnV0aW9uJTIwY2VudGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '20',
    name: 'Wylie Industrial Park',
    address: '3000 N Hwy 78, Wylie, TX 75098',
    latitude: 33.0143,
    longitude: -96.5330,
    price: 5200000,
    size: 95000,
    year: 2014,
    type: 'Industrial',
    features: ['Warehouse Units', 'Drive-In Doors', 'Storage Yard', 'Office Space', 'Highway Access'],
    description: 'Industrial park with variety of unit sizes and configurations for diverse business needs.',
    image: 'https://images.unsplash.com/photo-1622041173930-3e72c82cb5a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRpc3RyaWJ1dGlvbiUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '21',
    name: 'Rockwall Commerce Center',
    address: '1550 Airport Rd, Rockwall, TX 75087',
    latitude: 32.9302,
    longitude: -96.4376,
    price: 5800000,
    size: 102000,
    year: 2015,
    type: 'Industrial',
    features: ['Tilt-Wall Construction', 'Dock Doors', 'Office Space', 'Column Spacing', 'Trailer Parking'],
    description: 'Quality commerce center with modern industrial amenities and strategic location.',
    image: 'https://images.unsplash.com/photo-1627591730446-ed3b36bf75a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRpc3RyaWJ1dGlvbiUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '22',
    name: 'Forney Distribution Hub',
    address: '800 US-80, Forney, TX 75126',
    latitude: 32.7361,
    longitude: -96.4540,
    price: 6300000,
    size: 115000,
    year: 2016,
    type: 'Industrial',
    features: ['Distribution Facility', 'Cross-Dock', 'Staging Area', 'Office Area', 'Secure Perimeter'],
    description: 'Strategic distribution hub with excellent access to transportation networks.',
    image: 'https://images.unsplash.com/photo-1667820149951-67fe616ec61c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlzdHJpYnV0aW9uJTIwd2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '23',
    name: 'Cedar Hill Business Park',
    address: '1500 High Meadows Way, Cedar Hill, TX 75104',
    latitude: 32.5843,
    longitude: -96.9560,
    price: 4900000,
    size: 88000,
    year: 2013,
    type: 'Industrial',
    features: ['Flex Space', 'Loading Docks', 'Office Space', 'Warehouse Area', 'Highway Access'],
    description: 'Versatile business park with mixed-use spaces suitable for diverse industrial operations.',
    image: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGlzdHJpYnV0aW9uJTIwd2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '24',
    name: 'Rowlett Industrial Complex',
    address: '3900 Industrial St, Rowlett, TX 75088',
    latitude: 32.9154,
    longitude: -96.5375,
    price: 5500000,
    size: 97000,
    year: 2014,
    type: 'Industrial',
    features: ['Multi-Bay Facility', 'Dock Doors', 'Clear Height', 'Office Space', 'Fenced Yard'],
    description: 'Well-maintained industrial complex with versatile spaces for various business operations.',
    image: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlzdHJpYnV0aW9uJTIwd2FyZWhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '25',
    name: 'Flower Mound Business Center',
    address: '1800 Lakeside Pkwy, Flower Mound, TX 75028',
    latitude: 33.0418,
    longitude: -97.0470,
    price: 7200000,
    size: 125000,
    year: 2016,
    type: 'Industrial',
    features: ['Modern Design', 'Office/Warehouse', 'Loading Docks', 'Showroom Space', 'Energy Efficient'],
    description: 'Contemporary business center with premium spaces and energy-efficient features.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vZGVybiUyMHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '26',
    name: 'Lancaster Industrial Park',
    address: '2500 N Dallas Ave, Lancaster, TX 75134',
    latitude: 32.6276,
    longitude: -96.7561,
    price: 6100000,
    size: 108000,
    year: 2015,
    type: 'Industrial',
    features: ['Rail Access', 'Multiple Bays', 'Loading Docks', 'Yard Space', 'Security System'],
    description: 'Industrial park with rail access and various unit configurations for diverse business needs.',
    image: 'https://images.unsplash.com/photo-1599260554224-71d6be7d7654?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1vZGVybiUyMHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '27',
    name: 'Sunnyvale Logistics Hub',
    address: '450 Long Creek Rd, Sunnyvale, TX 75182',
    latitude: 32.7661,
    longitude: -96.5565,
    price: 5300000,
    size: 93000,
    year: 2013,
    type: 'Industrial',
    features: ['Logistics Center', 'Cross-Dock', 'Truck Court', 'Office Space', 'Security Gate'],
    description: 'Efficient logistics hub designed for seamless distribution operations and supply chain management.',
    image: 'https://images.unsplash.com/photo-1617391258031-f8d80b22fb37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9kZXJuJTIwd2FyZWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '28',
    name: 'Hutchins Distribution Center',
    address: '500 Wintergreen Rd, Hutchins, TX 75141',
    latitude: 32.6424,
    longitude: -96.7114,
    price: 9500000,
    size: 172000,
    year: 2017,
    type: 'Industrial',
    features: ['Major Distribution', 'High Ceiling', 'Multiple Bays', 'Trailer Storage', 'Security System'],
    description: 'Large-scale distribution center with comprehensive facilities for major logistics operations.',
    image: 'https://images.unsplash.com/photo-1586528116493-5a929fa2696f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1vZGVybiUyMHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '29',
    name: 'Red Oak Business Park',
    address: '700 E Ovilla Rd, Red Oak, TX 75154',
    latitude: 32.5240,
    longitude: -96.7613,
    price: 4800000,
    size: 87000,
    year: 2014,
    type: 'Industrial',
    features: ['Multi-Tenant', 'Dock High', 'Office Space', 'Common Areas', 'Flexible Units'],
    description: 'Business park with well-designed units suitable for various industrial and business operations.',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vZGVybiUyMHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '30',
    name: 'Coppell Fulfillment Center',
    address: '600 S Royal Ln, Coppell, TX 75019',
    latitude: 32.9518,
    longitude: -97.0138,
    price: 13200000,
    size: 245000,
    year: 2018,
    type: 'Industrial',
    features: ['Fulfillment Center', 'High Volume', 'Automation Ready', 'Loading Bays', 'Climate Control'],
    description: 'State-of-the-art fulfillment center designed for high-volume operations and modern logistics.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW9kZXJuJTIwd2FyZWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '31',
    name: 'Midlothian Industrial Park',
    address: '1500 N Hwy 67, Midlothian, TX 76065',
    latitude: 32.4951,
    longitude: -96.9916,
    price: 5100000,
    size: 94000,
    year: 2015,
    type: 'Industrial',
    features: ['Industrial Zoning', 'Multiple Units', 'Loading Areas', 'Office Space', 'Heavy Power'],
    description: 'Industrial park with various unit configurations suitable for manufacturing and distribution.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vZGVybiUyMHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '32',
    name: 'Seagoville Distribution Facility',
    address: '500 N Hwy 175, Seagoville, TX 75159',
    latitude: 32.6619,
    longitude: -96.5497,
    price: 4900000,
    size: 89000,
    year: 2013,
    type: 'Industrial',
    features: ['Distribution Space', 'Loading Docks', 'Clear Height', 'Office Area', 'Security Cameras'],
    description: 'Efficient distribution facility with practical design for streamlined logistics operations.',
    image: 'https://images.unsplash.com/photo-1492168732608-7de184483a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bG9naXN0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '33',
    name: 'North Dallas Tech Center',
    address: '17000 Dallas Pkwy, Dallas, TX 75248',
    latitude: 32.9927,
    longitude: -96.8329,
    price: 8100000,
    size: 127000,
    year: 2016,
    type: 'Industrial',
    features: ['Tech Ready', 'R&D Space', 'Loading Areas', 'Modern Design', 'Premium Office'],
    description: 'High-end tech center with specialized facilities for technology and research operations.',
    image: 'https://images.unsplash.com/photo-1565608438257-fac3c27aa6f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '34',
    name: 'Wilmer Logistics Park',
    address: '1200 E Pleasant Run Rd, Wilmer, TX 75172',
    latitude: 32.5947,
    longitude: -96.6768,
    price: 7400000,
    size: 135000,
    year: 2017,
    type: 'Industrial',
    features: ['Logistics Hub', 'Cross-Dock', 'Multiple Bays', 'Trailer Storage', 'Security System'],
    description: 'Strategic logistics park designed for efficient distribution and supply chain operations.',
    image: 'https://images.unsplash.com/photo-1554400541-5995a563b425?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9naXN0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '35',
    name: 'Ennis Manufacturing Center',
    address: '2500 W Ennis Ave, Ennis, TX 75119',
    latitude: 32.3291,
    longitude: -96.6458,
    price: 6800000,
    size: 118000,
    year: 2015,
    type: 'Industrial',
    features: ['Manufacturing Space', 'Heavy Power', 'Loading Docks', 'Cranes', 'Industrial Zoning'],
    description: 'Purpose-built manufacturing center with specialized infrastructure for industrial production.',
    image: 'https://images.unsplash.com/photo-1504917595314-f990613a99eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '36',
    name: 'Terrell Business Park',
    address: '1400 W Moore Ave, Terrell, TX 75160',
    latitude: 32.7352,
    longitude: -96.2987,
    price: 5200000,
    size: 95000,
    year: 2014,
    type: 'Industrial',
    features: ['Multi-Tenant', 'Loading Areas', 'Office Space', 'Flexible Units', 'Highway Access'],
    description: 'Business park with diverse spaces suitable for various industrial and commercial operations.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '37',
    name: 'South Dallas Fulfillment Center',
    address: '8000 S Lancaster Rd, Dallas, TX 75241',
    latitude: 32.6700,
    longitude: -96.7498,
    price: 12800000,
    size: 232000,
    year: 2019,
    type: 'Industrial',
    features: ['E-commerce Center', 'Automation Ready', 'High Volume', 'Loading Bays', 'Modern Design'],
    description: 'Advanced fulfillment center designed for e-commerce operations with automation capabilities.',
    image: 'https://images.unsplash.com/photo-1621112904887-419379ce6824?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '38',
    name: 'Mansfield Industrial Complex',
    address: '3000 E Broad St, Mansfield, TX 76063',
    latitude: 32.5631,
    longitude: -97.0899,
    price: 6400000,
    size: 110000,
    year: 2016,
    type: 'Industrial',
    features: ['Multiple Units', 'Loading Docks', 'Office Space', 'Clear Height', 'Flexible Space'],
    description: 'Industrial complex with versatile spaces suitable for various business operations.',
    image: 'https://images.unsplash.com/photo-1629312423084-d3308cb1c577?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '39',
    name: 'Burleson Warehouse Center',
    address: '2300 S Burleson Blvd, Burleson, TX 76028',
    latitude: 32.5268,
    longitude: -97.3205,
    price: 5700000,
    size: 103000,
    year: 2015,
    type: 'Industrial',
    features: ['Warehouse Space', 'Loading Docks', 'Clear Height', 'Office Area', 'Truck Court'],
    description: 'Practical warehouse center with efficient design for diverse storage and distribution needs.',
    image: 'https://images.unsplash.com/photo-1608031568635-1d7a8b3afeb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: '40',
    name: 'Denton Business Center',
    address: '3600 E McKinney St, Denton, TX 76209',
    latitude: 33.2161,
    longitude: -97.0808,
    price: 6700000,
    size: 115000,
    year: 2016,
    type: 'Industrial',
    features: ['Mixed-Use', 'Office/Warehouse', 'Modern Design', 'Loading Areas', 'Energy Efficient'],
    description: 'Contemporary business center with premium spaces for various industrial and commercial operations.',
    image: 'https://images.unsplash.com/photo-1487537023671-8dce1a785863?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
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
