
export type TrainType = 'ICE' | 'IC' | 'RE' | 'RB' | 'S-BAHN' | 'NJ';

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isHub: boolean;
}

export interface RouteStop {
  stationId: string;
  arrivalTime: string;
  departureTime: string;
  platform: string;
}

export interface Train {
  id: string;
  number: string;
  type: TrainType;
  originId: string;
  destinationId: string;
  currentLat: number;
  currentLng: number;
  speed: number;
  delay: number; // in minutes
  heading: number;
  occupancy: 'low' | 'medium' | 'high';
  stops: RouteStop[];
  progress: number; // 0 to 1
}

export interface NetworkStatus {
  totalTrains: number;
  onTimePercentage: number;
  majorDisruptions: string[];
  activeAlerts: number;
}
