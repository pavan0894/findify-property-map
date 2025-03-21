import { MapPin, Warehouse, Plane, Box, PackageCheck, Package, TruckIcon, Building2, Briefcase, Bus } from 'lucide-react';

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
  description?: string; // Added optional description property
}

// DFW area industrial properties managed by CBRE
export const properties: Property[] = [
  {
    id: 'prop-1',
    name: 'DFW Trade Center',
    type: 'Industrial',
    address: '4050 Valley View Ln, Dallas, TX 75244',
    price: 5250000,
    size: 45000,
    year: 2005,
    latitude: 32.925888,
    longitude: -96.834650,
    description: 'Modern industrial facility managed by CBRE. This property features High Ceilings and Loading Docks with excellent access to major transportation routes.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=1',
    features: ['Loading Docks', 'High Ceilings', '24/7 Security', 'HVAC System']
  },
  {
    id: 'prop-2',
    name: 'Irving Distribution Center',
    type: 'Industrial',
    address: '8200 Tristar Dr, Irving, TX 75063',
    price: 7800000,
    size: 82000,
    year: 2010,
    latitude: 32.913679,
    longitude: -96.980384,
    description: 'Large distribution warehouse managed by CBRE with easy access to DFW Airport. Features include Cross-Docking and Rail Access.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=2',
    features: ['Cross-Docking', 'Rail Access', 'Truck Court', 'Ample Parking']
  },
  {
    id: 'prop-3',
    name: 'Fort Worth Logistics Hub',
    type: 'Industrial',
    address: '6600 Marine Creek Pkwy, Fort Worth, TX 76179',
    price: 4950000,
    size: 36000,
    year: 2015,
    latitude: 32.828321,
    longitude: -97.408240,
    description: 'Strategic logistics facility managed by CBRE with modern amenities. Perfect for e-commerce fulfillment operations.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=3',
    features: ['Loading Docks', 'High Ceilings', 'Climate Control', 'Sprinkler System']
  },
  {
    id: 'prop-4',
    name: 'Garland Manufacturing Plant',
    type: 'Industrial',
    address: '2200 W Kingsley Rd, Garland, TX 75041',
    price: 6200000,
    size: 58000,
    year: 2001,
    latitude: 32.881742,
    longitude: -96.650797,
    description: 'Manufacturing facility managed by CBRE with heavy power capacity and reinforced flooring for industrial equipment.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=4',
    features: ['Heavy Power', 'Reinforced Flooring', 'Office Space', 'Loading Docks']
  },
  {
    id: 'prop-5',
    name: 'Plano Tech Warehouse',
    type: 'Industrial',
    address: '3000 Summit Ave, Plano, TX 75074',
    price: 3800000,
    size: 25000,
    year: 2018,
    latitude: 33.020186,
    longitude: -96.686624,
    description: 'Modern warehouse managed by CBRE suitable for tech companies. Includes office space and advanced security systems.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=5',
    features: ['Office Space', '24/7 Security', 'HVAC System', 'Column Spacing']
  },
  {
    id: 'prop-6',
    name: 'Carrollton Cold Storage',
    type: 'Industrial',
    address: '1425 Whitlock Ln, Carrollton, TX 75006',
    price: 8500000,
    size: 92000,
    year: 2012,
    latitude: 32.957780,
    longitude: -96.912482,
    description: 'Cold storage facility managed by CBRE with state-of-the-art refrigeration systems. Ideal for food and beverage distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=6',
    features: ['Climate Control', 'Loading Docks', 'HVAC System', 'Sprinkler System']
  },
  {
    id: 'prop-7',
    name: 'Arlington Assembly Facility',
    type: 'Industrial',
    address: '2200 Avenue J East, Arlington, TX 76011',
    price: 4200000,
    size: 38000,
    year: 2008,
    latitude: 32.736772,
    longitude: -97.078435,
    description: 'Assembly facility managed by CBRE with excellent column spacing and loading capacity. Close to major highways.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=7',
    features: ['Column Spacing', 'Loading Docks', 'High Ceilings', '24/7 Security']
  },
  {
    id: 'prop-8',
    name: 'Grand Prairie Distribution',
    type: 'Industrial',
    address: '2115 W Marshall Dr, Grand Prairie, TX 75051',
    price: 5800000,
    size: 65000,
    year: 2011,
    latitude: 32.746548,
    longitude: -97.031370,
    description: 'Large distribution center managed by CBRE with cross-docking capabilities. Located in the heart of DFW for optimal logistics.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=8',
    features: ['Cross-Docking', 'Truck Court', 'Fenced Yard', 'Office Space']
  },
  {
    id: 'prop-9',
    name: 'Mesquite Logistics Center',
    type: 'Industrial',
    address: '4180 N Belt Line Rd, Mesquite, TX 75150',
    price: 6400000,
    size: 70000,
    year: 2016,
    latitude: 32.833961,
    longitude: -96.613175,
    description: 'Modern logistics center managed by CBRE with advanced automation features. Close to I-635 for efficient distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=9',
    features: ['Loading Docks', 'High Ceilings', 'HVAC System', 'Sprinkler System']
  },
  {
    id: 'prop-10',
    name: 'Lewisville Industrial Park',
    type: 'Industrial',
    address: '1000 Enterprise Dr, Lewisville, TX 75057',
    price: 7200000,
    size: 78000,
    year: 2013,
    latitude: 33.050486,
    longitude: -96.980870,
    description: 'Industrial park managed by CBRE with multiple facilities available. Suitable for manufacturing and distribution operations.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=10',
    features: ['Ample Parking', 'Office Space', 'Loading Docks', 'Sprinkler System']
  },
  {
    id: 'prop-11',
    name: 'Addison Tech Hub',
    type: 'Industrial',
    address: '4255 Kellway Circle, Addison, TX 75001',
    price: 6100000,
    size: 55000,
    year: 2009,
    latitude: 32.973436,
    longitude: -96.829800,
    description: 'Modern tech industry warehouse managed by CBRE with office space and R&D facilities. Close to Dallas North Tollway.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=11',
    features: ['Office Space', 'HVAC System', '24/7 Security', 'High Ceilings']
  },
  {
    id: 'prop-12',
    name: 'Farmers Branch Distribution',
    type: 'Industrial',
    address: '11200 Denton Dr, Farmers Branch, TX 75234',
    price: 5500000,
    size: 60000,
    year: 2007,
    latitude: 32.901125,
    longitude: -96.889580,
    description: 'Distribution facility managed by CBRE with strategic location. Features rail access and cross-docking capabilities.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=12',
    features: ['Rail Access', 'Cross-Docking', 'Loading Docks', 'Truck Court']
  },
  {
    id: 'prop-13',
    name: 'Richardson Manufacturing',
    type: 'Industrial',
    address: '2801 E Plano Pkwy, Richardson, TX 75082',
    price: 4700000,
    size: 42000,
    year: 2014,
    latitude: 32.998750,
    longitude: -96.669660,
    description: 'Manufacturing facility managed by CBRE with heavy power and reinforced flooring. Ideal for precision manufacturing.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=13',
    features: ['Heavy Power', 'Reinforced Flooring', 'Column Spacing', 'High Ceilings']
  },
  {
    id: 'prop-14',
    name: 'Coppell Logistics Hub',
    type: 'Industrial',
    address: '780 S Royal Ln, Coppell, TX 75019',
    price: 9500000,
    size: 105000,
    year: 2017,
    latitude: 32.949010,
    longitude: -97.017250,
    description: 'Large logistics hub managed by CBRE with proximity to DFW Airport. Designed for e-commerce and retail distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=14',
    features: ['Cross-Docking', 'Loading Docks', 'High Ceilings', 'Truck Court']
  },
  {
    id: 'prop-15',
    name: 'Euless Industrial Center',
    type: 'Industrial',
    address: '2600 Westport Pkwy, Euless, TX 76040',
    price: 4100000,
    size: 38000,
    year: 2006,
    latitude: 32.832360,
    longitude: -97.073360,
    description: 'Industrial center managed by CBRE with convenient location between Dallas and Fort Worth. Multiple loading docks available.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=15',
    features: ['Loading Docks', 'HVAC System', 'Ample Parking', 'Office Space']
  },
  {
    id: 'prop-16',
    name: 'Duncanville Warehouse',
    type: 'Industrial',
    address: '1050 S Main St, Duncanville, TX 75137',
    price: 3900000,
    size: 35000,
    year: 2003,
    latitude: 32.634800,
    longitude: -96.909230,
    description: 'Warehouse facility managed by CBRE with good access to I-20. Suitable for small to medium distribution operations.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=16',
    features: ['Loading Docks', 'Sprinkler System', 'Fenced Yard', 'Office Space']
  },
  {
    id: 'prop-17',
    name: 'Alliance Gateway Logistics',
    type: 'Industrial',
    address: '15000 N Beach St, Fort Worth, TX 76177',
    price: 8700000,
    size: 95000,
    year: 2019,
    latitude: 32.993540,
    longitude: -97.284510,
    description: 'Premium logistics facility managed by CBRE in the Alliance Gateway area. State-of-the-art features for modern distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=17',
    features: ['Cross-Docking', 'High Ceilings', 'HVAC System', 'Truck Court']
  },
  {
    id: 'prop-18',
    name: 'Grapevine Cold Storage',
    type: 'Industrial',
    address: '1500 W Northwest Hwy, Grapevine, TX 76051',
    price: 7300000,
    size: 76000,
    year: 2015,
    latitude: 32.856980,
    longitude: -97.092910,
    description: 'Cold storage facility managed by CBRE near DFW Airport. Features climate control systems for perishable goods.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=18',
    features: ['Climate Control', 'Loading Docks', 'HVAC System', 'Sprinkler System']
  },
  {
    id: 'prop-19',
    name: 'Haltom City Flex Space',
    type: 'Industrial',
    address: '5500 Airport Fwy, Haltom City, TX 76117',
    price: 4500000,
    size: 42000,
    year: 2010,
    latitude: 32.805910,
    longitude: -97.255850,
    description: 'Flexible industrial space managed by CBRE suitable for light manufacturing. Includes both warehouse and office components.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=19',
    features: ['Office Space', 'Loading Docks', 'HVAC System', 'Ample Parking']
  },
  {
    id: 'prop-20',
    name: 'Cedar Hill Warehouse',
    type: 'Industrial',
    address: '1515 High Meadows Way, Cedar Hill, TX 75104',
    price: 3600000,
    size: 32000,
    year: 2011,
    latitude: 32.584780,
    longitude: -96.958450,
    description: 'Warehouse facility managed by CBRE with fenced yard and security features. Located in southern DFW region.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=20',
    features: ['Fenced Yard', '24/7 Security', 'Loading Docks', 'Office Space']
  },
  {
    id: 'prop-21',
    name: 'North Dallas Distribution',
    type: 'Industrial',
    address: '4250 Sigma Rd, Dallas, TX 75244',
    price: 6900000,
    size: 68000,
    year: 2008,
    latitude: 32.929820,
    longitude: -96.845930,
    description: 'Distribution center managed by CBRE in North Dallas. Excellent access to major highways for regional distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=21',
    features: ['Loading Docks', 'Cross-Docking', 'High Ceilings', 'Truck Court']
  },
  {
    id: 'prop-22',
    name: 'McKinney Industrial Park',
    type: 'Industrial',
    address: '2950 S McDonald St, McKinney, TX 75069',
    price: 5100000,
    size: 47000,
    year: 2013,
    latitude: 33.163880,
    longitude: -96.617730,
    description: 'Industrial park managed by CBRE with multiple units available. Modern facilities in growing McKinney area.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=22',
    features: ['Loading Docks', 'Office Space', 'HVAC System', 'Sprinkler System']
  },
  {
    id: 'prop-23',
    name: 'South Fort Worth Logistics',
    type: 'Industrial',
    address: '7300 Jack Newell Blvd S, Fort Worth, TX 76118',
    price: 7800000,
    size: 85000,
    year: 2016,
    latitude: 32.760250,
    longitude: -97.280420,
    description: 'Logistics facility managed by CBRE in South Fort Worth. Designed for large-scale distribution operations.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=23',
    features: ['Cross-Docking', 'High Ceilings', 'Truck Court', 'Loading Docks']
  },
  {
    id: 'prop-24',
    name: 'Hurst Manufacturing Facility',
    type: 'Industrial',
    address: '500 Mid Cities Blvd, Hurst, TX 76054',
    price: 4300000,
    size: 39000,
    year: 2005,
    latitude: 32.832650,
    longitude: -97.162640,
    description: 'Manufacturing facility managed by CBRE with heavy power capacity. Good for light to medium industrial production.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=24',
    features: ['Heavy Power', 'Office Space', 'Loading Docks', 'HVAC System']
  },
  {
    id: 'prop-25',
    name: 'DeSoto Warehouse Center',
    type: 'Industrial',
    address: '800 N Hampton Rd, DeSoto, TX 75115',
    price: 4800000,
    size: 44000,
    year: 2012,
    latitude: 32.623350,
    longitude: -96.856390,
    description: 'Warehouse center managed by CBRE in southern Dallas County. Features modern loading facilities and security systems.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=25',
    features: ['Loading Docks', '24/7 Security', 'Sprinkler System', 'Fenced Yard']
  },
  {
    id: 'prop-26',
    name: 'East Dallas Manufacturing',
    type: 'Industrial',
    address: '8250 East R L Thornton Fwy, Dallas, TX 75228',
    price: 5500000,
    size: 55000,
    year: 2009,
    latitude: 32.794760,
    longitude: -96.693080,
    description: 'Manufacturing space managed by CBRE in East Dallas. Features reinforced flooring and heavy power for industrial equipment.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=26',
    features: ['Reinforced Flooring', 'Heavy Power', 'Loading Docks', 'Office Space']
  },
  {
    id: 'prop-27',
    name: 'Frisco Tech Warehouse',
    type: 'Industrial',
    address: '9250 John W. Elliott Dr, Frisco, TX 75033',
    price: 6300000,
    size: 58000,
    year: 2018,
    latitude: 33.153930,
    longitude: -96.824350,
    description: 'Modern tech-oriented warehouse managed by CBRE in Frisco. Suitable for high-tech manufacturing and storage.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=27',
    features: ['HVAC System', '24/7 Security', 'Office Space', 'High Ceilings']
  },
  {
    id: 'prop-28',
    name: 'Bedford Distribution Center',
    type: 'Industrial',
    address: '1950 Airport Fwy, Bedford, TX 76022',
    price: 4900000,
    size: 45000,
    year: 2007,
    latitude: 32.846180,
    longitude: -97.137350,
    description: 'Distribution center managed by CBRE in Bedford. Strategic mid-cities location for regional distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=28',
    features: ['Loading Docks', 'Cross-Docking', 'Truck Court', 'Sprinkler System']
  },
  {
    id: 'prop-29',
    name: 'Wylie Industrial Facility',
    type: 'Industrial',
    address: '1800 N State Hwy 78, Wylie, TX 75098',
    price: 3900000,
    size: 36000,
    year: 2014,
    latitude: 33.025810,
    longitude: -96.530400,
    description: 'Industrial facility managed by CBRE in eastern DFW area. Good access to regional highways for distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=29',
    features: ['Loading Docks', 'Office Space', 'HVAC System', 'Fenced Yard']
  },
  {
    id: 'prop-30',
    name: 'North Richland Hills Logistics',
    type: 'Industrial',
    address: '8900 Boulevard 26, North Richland Hills, TX 76180',
    price: 5200000,
    size: 48000,
    year: 2011,
    latitude: 32.866210,
    longitude: -97.214920,
    description: 'Logistics facility managed by CBRE in North Richland Hills. Well-maintained property with good highway access.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=30',
    features: ['Loading Docks', 'High Ceilings', 'Truck Court', 'Office Space']
  },
  {
    id: 'prop-31',
    name: 'Mansfield Industrial Park',
    type: 'Industrial',
    address: '1500 Heritage Pkwy, Mansfield, TX 76063',
    price: 4700000,
    size: 43000,
    year: 2015,
    latitude: 32.569680,
    longitude: -97.110830,
    description: 'Industrial park managed by CBRE in Mansfield. Growing area with modern industrial facilities.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=31',
    features: ['Loading Docks', 'HVAC System', 'Sprinkler System', 'Ample Parking']
  },
  {
    id: 'prop-32',
    name: 'Rowlett Warehouse',
    type: 'Industrial',
    address: '3800 Enterprise Dr, Rowlett, TX 75088',
    price: 3800000,
    size: 34000,
    year: 2010,
    latitude: 32.914150,
    longitude: -96.558290,
    description: 'Warehouse facility managed by CBRE in northeast DFW. Clean, well-maintained space for storage and light distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=32',
    features: ['Loading Docks', 'Office Space', 'Sprinkler System', 'Fenced Yard']
  },
  {
    id: 'prop-33',
    name: 'Great Southwest Industrial',
    type: 'Industrial',
    address: '2900 Avenue E East, Arlington, TX 76011',
    price: 6800000,
    size: 72000,
    year: 2013,
    latitude: 32.764280,
    longitude: -97.045850,
    description: 'Industrial property managed by CBRE in the Great Southwest Industrial District. Prime location for regional distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=33',
    features: ['Cross-Docking', 'Loading Docks', 'High Ceilings', 'Truck Court']
  },
  {
    id: 'prop-34',
    name: 'Sachse Industrial Facility',
    type: 'Industrial',
    address: '6400 Ranch Road, Sachse, TX 75048',
    price: 4100000,
    size: 38000,
    year: 2014,
    latitude: 32.980770,
    longitude: -96.541050,
    description: 'Industrial facility managed by CBRE in Sachse. Newer construction with modern amenities for light manufacturing.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=34',
    features: ['Loading Docks', 'Office Space', 'HVAC System', 'Sprinkler System']
  },
  {
    id: 'prop-35',
    name: 'Rockwall Distribution Center',
    type: 'Industrial',
    address: '1540 Capital Dr, Rockwall, TX 75032',
    price: 5300000,
    size: 50000,
    year: 2016,
    latitude: 32.899140,
    longitude: -96.459180,
    description: 'Distribution center managed by CBRE in Rockwall. Eastern DFW location with good access to I-30.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=35',
    features: ['Loading Docks', 'Cross-Docking', 'High Ceilings', 'Office Space']
  },
  {
    id: 'prop-36',
    name: 'Lancaster Logistics Hub',
    type: 'Industrial',
    address: '2950 N Dallas Ave, Lancaster, TX 75134',
    price: 6500000,
    size: 68000,
    year: 2017,
    latitude: 32.641520,
    longitude: -96.753290,
    description: 'Logistics hub managed by CBRE in Lancaster. Modern facility in southern Dallas County with rail access.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=36',
    features: ['Rail Access', 'Loading Docks', 'Cross-Docking', 'Truck Court']
  },
  {
    id: 'prop-37',
    name: 'Burleson Industrial Center',
    type: 'Industrial',
    address: '625 NE Alsbury Blvd, Burleson, TX 76028',
    price: 4400000,
    size: 40000,
    year: 2012,
    latitude: 32.554410,
    longitude: -97.320090,
    description: 'Industrial center managed by CBRE in Burleson. Southern Tarrant County location with good highway access.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=37',
    features: ['Loading Docks', 'Office Space', 'HVAC System', 'Fenced Yard']
  },
  {
    id: 'prop-38',
    name: 'Northwest Dallas Warehouse',
    type: 'Industrial',
    address: '11050 Stemmons Fwy, Dallas, TX 75229',
    price: 5900000,
    size: 56000,
    year: 2008,
    latitude: 32.889480,
    longitude: -96.908970,
    description: 'Warehouse facility managed by CBRE in Northwest Dallas. Excellent location near I-35E and I-635 interchange.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=38',
    features: ['Loading Docks', 'High Ceilings', 'Sprinkler System', 'Truck Court']
  },
  {
    id: 'prop-39',
    name: 'Southlake Flex Space',
    type: 'Industrial',
    address: '775 Reserve St, Southlake, TX 76092',
    price: 5100000,
    size: 45000,
    year: 2015,
    latitude: 32.940550,
    longitude: -97.143320,
    description: 'Flexible industrial space managed by CBRE in upscale Southlake. High-end features with office and warehouse components.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=39',
    features: ['Office Space', 'Loading Docks', 'HVAC System', '24/7 Security']
  },
  {
    id: 'prop-40',
    name: 'Allen Manufacturing Facility',
    type: 'Industrial',
    address: '1305 N Watters Rd, Allen, TX 75013',
    price: 4900000,
    size: 44000,
    year: 2014,
    latitude: 33.117720,
    longitude: -96.672680,
    description: 'Manufacturing facility managed by CBRE in Allen. Modern construction with reinforced flooring for equipment.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=40',
    features: ['Reinforced Flooring', 'Heavy Power', 'Loading Docks', 'Office Space']
  },
  {
    id: 'prop-41',
    name: 'Balch Springs Industrial',
    type: 'Industrial',
    address: '12300 Seagoville Rd, Balch Springs, TX 75180',
    price: 3600000,
    size: 33000,
    year: 2007,
    latitude: 32.708040,
    longitude: -96.595720,
    description: 'Industrial property managed by CBRE in Balch Springs. Southeast Dallas County location with good value.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=41',
    features: ['Loading Docks', 'Fenced Yard', 'Sprinkler System', 'Office Space']
  },
  {
    id: 'prop-42',
    name: 'East Fort Worth Distribution',
    type: 'Industrial',
    address: '5601 Bridge St, Fort Worth, TX 76112',
    price: 4800000,
    size: 46000,
    year: 2010,
    latitude: 32.768930,
    longitude: -97.230120,
    description: 'Distribution facility managed by CBRE in East Fort Worth. Good access to I-30 for regional distribution.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=42',
    features: ['Loading Docks', 'Cross-Docking', 'Truck Court', 'Sprinkler System']
  },
  {
    id: 'prop-43',
    name: 'Princeton Industrial Park',
    type: 'Industrial',
    address: '2000 W Princeton Dr, Princeton, TX 75407',
    price: 3900000,
    size: 35000,
    year: 2016,
    latitude: 33.181110,
    longitude: -96.509470,
    description: 'Industrial park managed by CBRE in Princeton. Newer development in growing Collin County area.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=43',
    features: ['Loading Docks', 'High Ceilings', 'HVAC System', 'Office Space']
  },
  {
    id: 'prop-44',
    name: 'Waxahachie Distribution Center',
    type: 'Industrial',
    address: '300 Solon Road, Waxahachie, TX 75165',
    price: 5200000,
    size: 52000,
    year: 2013,
    latitude: 32.401540,
    longitude: -96.848260,
    description: 'Distribution center managed by CBRE in Waxahachie. Southern DFW location with excellent I-35E access.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=44',
    features: ['Loading Docks', 'Cross-Docking', 'Truck Court', 'Sprinkler System']
  },
  {
    id: 'prop-45',
    name: 'Colleyville Flex Warehouse',
    type: 'Industrial',
    address: '5201 Pool Rd, Colleyville, TX 76034',
    price: 4100000,
    size: 37000,
    year: 2011,
    latitude: 32.893850,
    longitude: -97.149180,
    description: 'Flex warehouse managed by CBRE in Colleyville. Mid-cities location with mixed office and warehouse space.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=45',
    features: ['Office Space', 'Loading Docks', 'HVAC System', '24/7 Security']
  },
  {
    id: 'prop-46',
    name: 'Keller Industrial Center',
    type: 'Industrial',
    address: '800 Keller Pkwy, Keller, TX 76248',
    price: 3800000,
    size: 34000,
    year: 2015,
    latitude: 32.932780,
    longitude: -97.256190,
    description: 'Industrial center managed by CBRE in Keller. Clean, modern facility in upscale northern Tarrant County.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=46',
    features: ['Loading Docks', 'Office Space', 'HVAC System', 'Sprinkler System']
  },
  {
    id: 'prop-47',
    name: 'West Dallas Manufacturing',
    type: 'Industrial',
    address: '2300 Singleton Blvd, Dallas, TX 75212',
    price: 4700000,
    size: 43000,
    year: 2009,
    latitude: 32.781840,
    longitude: -96.860690,
    description: 'Manufacturing facility managed by CBRE in West Dallas. Renovated property with heavy power and reinforced flooring.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=47',
    features: ['Heavy Power', 'Reinforced Flooring', 'Loading Docks', 'Fenced Yard']
  },
  {
    id: 'prop-48',
    name: 'South Irving Industrial',
    type: 'Industrial',
    address: '3601 W Airport Fwy, Irving, TX 75062',
    price: 5600000,
    size: 54000,
    year: 2012,
    latitude: 32.837890,
    longitude: -97.017480,
    description: 'Industrial property managed by CBRE in South Irving. Excellent location with easy access to DFW Airport.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=48',
    features: ['Loading Docks', 'High Ceilings', 'Truck Court', 'Office Space']
  },
  {
    id: 'prop-49',
    name: 'Seagoville Distribution',
    type: 'Industrial',
    address: '600 E Malloy Bridge Rd, Seagoville, TX 75159',
    price: 4200000,
    size: 39000,
    year: 2013,
    latitude: 32.653020,
    longitude: -96.540030,
    description: 'Distribution facility managed by CBRE in Seagoville. Southeast DFW location with good highway access.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=49',
    features: ['Loading Docks', 'Cross-Docking', 'Fenced Yard', 'Sprinkler System']
  },
  {
    id: 'prop-50',
    name: 'Little Elm Warehouse',
    type: 'Industrial',
    address: '2600 FM 423, Little Elm, TX 75068',
    price: 3500000,
    size: 31000,
    year: 2017,
    latitude: 33.167880,
    longitude: -96.890340,
    description: 'Warehouse facility managed by CBRE in Little Elm. Newer construction in growing northern DFW area.',
    image: 'https://source.unsplash.com/collection/3573299/800x600?sig=50',
    features: ['Loading Docks', 'High Ceilings', 'Office Space', 'HVAC System']
  }
];

// Updated logistics-focused POI types
const poiTypes = [
  { type: 'FedEx', icon: Package },
  { type: 'UPS', icon: Box },
  { type: 'Shipping Center', icon: PackageCheck },
  { type: 'Airport', icon: Plane }
];

// Create realistic logistics POIs in DFW area
export const pointsOfInterest: POI[] = [
  // FedEx locations
  {
    id: 'poi-1',
    name: 'FedEx Ship Center',
    type: 'FedEx',
    latitude: 32.9072,
    longitude: -96.8388,
    icon: Package
  },
  {
    id: 'poi-2',
    name: 'FedEx Office Print & Ship Center',
    type: 'FedEx',
    latitude: 32.8307,
    longitude: -96.8321,
    icon: Package
  },
  {
    id: 'poi-3',
    name: 'FedEx Ground',
    type: 'FedEx',
    latitude: 32.9849,
    longitude: -96.9951,
    icon: Package
  },
  {
    id: 'poi-4',
    name: 'FedEx Logistics',
    type: 'FedEx',
    latitude: 32.7639,
    longitude: -97.0935,
    icon: Package
  },
  {
    id: 'poi-5',
    name: 'FedEx Freight',
    type: 'FedEx',
    latitude: 32.8741,
    longitude: -97.0425,
    icon: Package
  },
  {
    id: 'poi-6',
    name: 'FedEx Ship Center Plano',
    type: 'FedEx',
    latitude: 33.0812,
    longitude: -96.7914,
    icon: Package
  },
  {
    id: 'poi-7',
    name: 'FedEx Ship Center Arlington',
    type: 'FedEx',
    latitude: 32.7273,
    longitude: -97.1151,
    icon: Package
  },
  
  // UPS locations
  {
    id: 'poi-8',
    name: 'UPS Customer Center',
    type: 'UPS',
    latitude: 32.9143,
    longitude: -96.9071,
    icon: Box
  },
  {
    id: 'poi-9',
    name: 'The UPS Store',
    type: 'UPS',
    latitude: 32.8553,
    longitude: -96.7705,
    icon: Box
  },
  {
    id: 'poi-10',
    name: 'UPS Freight',
    type: 'UPS',
    latitude: 32.7761,
    longitude: -96.8982,
    icon: Box
  },
  {
    id: 'poi-11',
    name: 'UPS Distribution Center',
    type: 'UPS',
    latitude: 32.8837,
    longitude: -96.9613,
    icon: Box
  },
  {
    id: 'poi-12',
    name: 'UPS Access Point',
    type: 'UPS',
    latitude: 32.7947,
    longitude: -96.7700,
    icon: Box
  },
  {
    id: 'poi-13',
    name: 'UPS Customer Center Fort Worth',
    type: 'UPS',
    latitude: 32.7954,
    longitude: -97.3301,
    icon: Box
  },
  {
    id: 'poi-14',
    name: 'UPS Supply Chain Solutions',
    type: 'UPS',
    latitude: 32.9001,
    longitude: -97.0368,
    icon: Box
  },
  
  // Shipping Centers
  {
    id: 'poi-15',
    name: 'Alliance Global Logistics Hub',
    type: 'Shipping Center',
    latitude: 32.9872,
    longitude: -97.3188,
    icon: PackageCheck
  },
  {
    id: 'poi-16',
    name: 'Intermodal Container Transfer Facility',
    type: 'Shipping Center',
    latitude: 32.7713,
    longitude: -96.7848,
    icon: PackageCheck
  },
  {
    id: 'poi-17',
    name: 'BNSF Logistics Center',
    type: 'Shipping Center',
    latitude: 32.9718,
    longitude: -97.2908,
    icon: PackageCheck
  },
  {
    id: 'poi-18',
    name: 'Southwest Freight Logistics Center',
    type: 'Shipping Center',
    latitude: 32.6894,
    longitude: -97.0133,
    icon: PackageCheck
  },
  {
    id: 'poi-19',
    name: 'Dallas Logistics Hub',
    type: 'Shipping Center',
    latitude: 32.6417,
    longitude: -96.8534,
    icon: PackageCheck
  },
  {
    id: 'poi-20',
    name: 'DFW Trade Center',
    type: 'Shipping Center',
    latitude: 32.9223,
    longitude: -97.0376,
    icon: PackageCheck
  },
  
  // Airports
  {
    id: 'poi-21',
    name: 'Dallas/Fort Worth International Airport',
    type: 'Airport',
    latitude: 32.8998,
    longitude: -97.0403,
    icon: Plane
  },
  {
    id: 'poi-22',
    name: 'Dallas Love Field Airport',
    type: 'Airport',
    latitude: 32.8481,
    longitude: -96.8518,
    icon: Plane
  },
  {
    id: 'poi-23',
    name: 'Fort Worth Alliance Airport',
    type: 'Airport',
    latitude: 32.9872,
    longitude: -97.3188,
    icon: Plane
  },
  {
    id: 'poi-24',
    name: 'Fort Worth Meacham International Airport',
    type: 'Airport',
    latitude: 32.8196,
    longitude: -97.3622,
    icon: Plane
  },
  {
    id: 'poi-25',
    name: 'Addison Airport',
    type: 'Airport',
    latitude: 32.9686,
    longitude: -96.8382,
    icon: Plane
  },
  {
    id: 'poi-26',
    name: 'Grand Prairie Municipal Airport',
    type: 'Airport',
    latitude: 32.6989,
    longitude: -97.0459,
    icon: Plane
  },
  {
    id: 'poi-27',
    name: 'Arlington Municipal Airport',
    type: 'Airport',
    latitude: 32.6638,
    longitude: -97.0944,
    icon: Plane
  }
];

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
