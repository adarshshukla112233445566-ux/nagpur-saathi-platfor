export interface Destination {
  id: string;
  name: string;
  category: 'Lakes' | 'Parks' | 'Heritage' | 'Food' | 'Family' | 'Events';
  location: string;
  description: string;
  image: string;
  featured?: boolean;
}

export const destinations: Destination[] = [
  { id: 'futala-lake', name: 'Futala Lake', category: 'Lakes', location: 'Futala Lake, Nagpur', description: 'A historic lake surrounded by vibrant food stalls and a musical fountain show in the evenings.', image: 'https://images.pexels.com/photos/39059204/pexels-photo-39059204.jpeg?auto=compress&cs=tinysrgb&w=1200', featured: true },
  { id: 'ambazari-lake', name: 'Ambazari Lake & Garden', category: 'Lakes', location: 'Ambazari, Nagpur', description: 'Scenic lakefront garden with boating, a children play area, and walking trails.', image: 'https://images.pexels.com/photos/12753511/pexels-photo-12753511.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { id: 'deekshabhoomi', name: 'Deekshabhoomi', category: 'Heritage', location: 'Sitabuldi, Nagpur', description: 'A sacred Buddhist monument where Dr. B.R. Ambedkar embraced Buddhism with his followers.', image: 'https://images.pexels.com/photos/5103732/pexels-photo-5103732.jpeg?auto=compress&cs=tinysrgb&w=1200', featured: true },
  { id: 'ramtek-fort', name: 'Ramtek Fort Temple', category: 'Heritage', location: 'Ramtek, near Nagpur', description: 'A hilltop temple and fort with mythological connections to the Ramayana and panoramic valley views.', image: 'https://images.pexels.com/photos/19867674/pexels-photo-19867674.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { id: 'japanese-garden', name: 'Japanese Garden', category: 'Parks', location: 'Sonegaon, Nagpur', description: 'A tranquil garden styled after Japanese landscaping, ideal for morning walks and family outings.', image: 'https://images.pexels.com/photos/31981248/pexels-photo-31981248.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { id: 'maharaj-bagh', name: 'Maharaj Bagh Zoo', category: 'Family', location: 'Civil Lines, Nagpur', description: 'A historic botanical garden and small zoo in the heart of the city, popular with families.', image: 'https://images.pexels.com/photos/19361345/pexels-photo-19361345.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { id: 'sadar-food', name: 'Sadar Food Street', category: 'Food', location: 'Sadar, Nagpur', description: 'Nagpur iconic evening food lane known for Saoji cuisine, kebabs, and the famous orange barfi.', image: 'https://images.pexels.com/photos/984534/pexels-photo-984534.jpeg?auto=compress&cs=tinysrgb&w=1200', featured: true },
  { id: 'raman-science', name: 'Raman Science Centre', category: 'Family', location: 'Gandhi Sagar, Nagpur', description: 'An interactive science museum named after Nobel laureate C.V. Raman, great for children.', image: 'https://images.pexels.com/photos/8926847/pexels-photo-8926847.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

export interface EmergencyService {
  id: string;
  category: 'Hospitals' | 'Police' | 'Fire' | 'Ambulance' | 'Pharmacies';
  name: string;
  location: string;
  service: string;
  phone: string;
}

export const emergencyServices: EmergencyService[] = [
  { id: 'aiims-nagpur', category: 'Hospitals', name: 'AIIMS Nagpur', location: 'Waddhamna, Nagpur', service: 'Multi-specialty, 24x7 emergency', phone: '108' },
  { id: 'gmc-nagpur', category: 'Hospitals', name: 'Government Medical College Hospital', location: 'Medical Square, Nagpur', service: 'Government hospital, trauma care', phone: '0712-274-6300' },
  { id: 'orange-city', category: 'Hospitals', name: 'Orange City Hospital & Research Institute', location: 'Shankar Nagar, Nagpur', service: 'Private multi-specialty', phone: '0712-222-2222' },
  { id: 'wcl-hospital', category: 'Hospitals', name: 'WCL Hospital', location: 'Mankhurd, Nagpur', service: 'Community hospital', phone: '0712-256-1234' },
  { id: 'sitabuldi-police', category: 'Police', name: 'Sitabuldi Police Station', location: 'Sitabuldi, Nagpur', service: 'City police', phone: '100' },
  { id: 'dhantoli-police', category: 'Police', name: 'Dhantoli Police Station', location: 'Dhantoli, Nagpur', service: 'City police', phone: '0712-244-5500' },
  { id: 'nagpur-fire', category: 'Fire', name: 'Nagpur Fire Brigade HQ', location: 'Cotton Market, Nagpur', service: 'Fire and rescue', phone: '101' },
  { id: 'ambulance-108', category: 'Ambulance', name: 'National Ambulance Service', location: 'Citywide, Nagpur', service: 'Free emergency ambulance', phone: '108' },
  { id: 'ambulance-dial', category: 'Ambulance', name: 'Dial for Ambulance', location: 'Citywide, Nagpur', service: 'Private ambulance network', phone: '104' },
  { id: 'medplus-sadar', category: 'Pharmacies', name: 'MedPlus Sadar', location: 'Sadar, Nagpur', service: '24x7 pharmacy', phone: '0712-250-1234' },
  { id: 'apollo-pharma', category: 'Pharmacies', name: 'Apollo Pharmacy Dharampeth', location: 'Dharampeth, Nagpur', service: '24x7 pharmacy', phone: '0712-260-5678' },
];

export interface TransportRoute {
  id: string;
  route: string;
  stops: string[];
  time: string;
  status: 'On Time' | 'Delayed' | 'Running';
}

export const transportRoutes: TransportRoute[] = [
  { id: 'bus-1', route: 'Bus 25 — Sitabuldi to Hingna', stops: ['Sitabuldi', 'Dhantoli', 'Laxmi Nagar', 'Besa', 'Hingna'], time: '38 min', status: 'Running' },
  { id: 'bus-2', route: 'Bus 51 — Railway Station to Airport', stops: ['Railway Station', 'Ajni', 'Manish Nagar', 'Airport'], time: '26 min', status: 'On Time' },
  { id: 'bus-3', route: 'Metro Orange Line — Automotive Square to Khapri', stops: ['Automotive Square', 'LAD College', 'Zero Mile', 'Sitabuldi', 'Rahate Colony', 'Airport', 'Khapri'], time: '34 min', status: 'On Time' },
  { id: 'bus-4', route: 'Bus 108 — Civil Lines to Wadi', stops: ['Civil Lines', 'Sadar', 'Lakshmi Nagar', 'Wadi'], time: '44 min', status: 'Delayed' },
];

export interface TrafficArea {
  area: string;
  status: 'Smooth' | 'Moderate' | 'Heavy' | 'Congested';
  detail: string;
}

export const trafficAreas: TrafficArea[] = [
  { area: 'Zero Mile', status: 'Heavy', detail: 'Peak hour congestion near the central junction.' },
  { area: 'Sitabuldi', status: 'Moderate', detail: 'Steady flow, minor delays at the flyover.' },
  { area: 'Wardha Road', status: 'Smooth', detail: 'Clear run between Airport and Medical Square.' },
  { area: 'Gaddigodam', status: 'Congested', detail: 'Heavy congestion due to ongoing metro work.' },
];

export interface TrafficIncident {
  title: string;
  area: string;
  detail: string;
}

export const trafficIncidents: TrafficIncident[] = [
  { title: 'Roadwork on Gaddigodam', area: 'Gaddigodam', detail: 'Single lane open due to metro construction.' },
  { title: 'Vehicle breakdown near Ajni', area: 'Ajni', detail: 'Right lane blocked, expect 10 min delay.' },
];

export interface CityAlert {
  id: string;
  type: 'Traffic' | 'Weather' | 'Civic' | 'Emergency' | 'Public Notice';
  title: string;
  description: string;
  area: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  time: string;
}

export const cityAlerts: CityAlert[] = [
  { id: 'alert-1', type: 'Traffic', title: 'Metro construction on Wardha Road', description: 'Lane diversions near Gaddigodam from 10 AM to 6 PM.', area: 'Wardha Road', priority: 'Medium', time: '2 hours ago' },
  { id: 'alert-2', type: 'Weather', title: 'Thunderstorm warning', description: 'Light to moderate rain with thunder expected this evening.', area: 'Nagpur city', priority: 'High', time: '5 hours ago' },
  { id: 'alert-3', type: 'Civic', title: 'Water supply interruption', description: 'Scheduled maintenance in Dhantoli zone from 9 AM to 4 PM.', area: 'Dhantoli', priority: 'Medium', time: 'Yesterday' },
  { id: 'alert-4', type: 'Public Notice', title: 'Property tax deadline extended', description: 'Last date for property tax payment extended to end of month.', area: 'All zones', priority: 'Low', time: '2 days ago' },
];

export interface MapMarker {
  id: string;
  layer: 'Traffic' | 'Hospitals' | 'Police' | 'Fire' | 'Complaints' | 'Animal Rescue' | 'Tourist Places' | 'Parks';
  label: string;
  x: number;
  y: number;
  detail: string;
}

export const mapMarkers: MapMarker[] = [
  { id: 'm-h1', layer: 'Hospitals', label: 'AIIMS Nagpur', x: 30, y: 70, detail: 'Multi-specialty hospital, 24x7 emergency.' },
  { id: 'm-h2', layer: 'Hospitals', label: 'GMC Hospital', x: 52, y: 48, detail: 'Government hospital, trauma care.' },
  { id: 'm-p1', layer: 'Police', label: 'Sitabuldi PS', x: 50, y: 50, detail: 'City police station.' },
  { id: 'm-f1', layer: 'Fire', label: 'Fire Brigade HQ', x: 58, y: 44, detail: 'Fire and rescue services.' },
  { id: 'm-t1', layer: 'Traffic', label: 'Zero Mile', x: 48, y: 52, detail: 'Heavy congestion during peak hours.' },
  { id: 'm-t2', layer: 'Traffic', label: 'Gaddigodam', x: 42, y: 40, detail: 'Congestion due to metro work.' },
  { id: 'm-tour1', layer: 'Tourist Places', label: 'Deekshabhoomi', x: 54, y: 56, detail: 'Sacred Buddhist monument.' },
  { id: 'm-tour2', layer: 'Tourist Places', label: 'Futala Lake', x: 28, y: 38, detail: 'Lake with food stalls and fountain show.' },
  { id: 'm-park1', layer: 'Parks', label: 'Japanese Garden', x: 34, y: 60, detail: 'Tranquil Japanese-style garden.' },
  { id: 'm-park2', layer: 'Parks', label: 'Ambazari Garden', x: 22, y: 52, detail: 'Lakefront garden and boating.' },
];
