
import { Train, Station, RouteStop, TrainType } from '../types.ts';
import { STATIONS, TRAIN_TYPES } from '../constants.ts';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateStops = (origin: Station, destination: Station): RouteStop[] => {
  // Simple simulation of stops: just origin and destination for now
  return [
    {
      stationId: origin.id,
      arrivalTime: '10:00',
      departureTime: '10:05',
      platform: Math.floor(Math.random() * 20 + 1).toString()
    },
    {
      stationId: destination.id,
      arrivalTime: '12:00',
      departureTime: '12:05',
      platform: Math.floor(Math.random() * 20 + 1).toString()
    }
  ];
};

export const generateInitialTrains = (count: number): Train[] => {
  const trains: Train[] = [];
  for (let i = 0; i < count; i++) {
    const origin = getRandomElement(STATIONS);
    let destination = getRandomElement(STATIONS);
    while (destination.id === origin.id) {
      destination = getRandomElement(STATIONS);
    }

    const type = getRandomElement(TRAIN_TYPES);
    const progress = Math.random();
    
    // Interpolate position
    const currentLat = origin.lat + (destination.lat - origin.lat) * progress;
    const currentLng = origin.lng + (destination.lng - origin.lng) * progress;

    trains.push({
      id: `tr-${i}`,
      number: `${type} ${Math.floor(Math.random() * 9000 + 100)}`,
      type,
      originId: origin.id,
      destinationId: destination.id,
      currentLat,
      currentLng,
      speed: type === 'ICE' ? 250 + Math.random() * 50 : 120 + Math.random() * 40,
      delay: Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0,
      heading: Math.atan2(destination.lng - origin.lng, destination.lat - origin.lat) * (180 / Math.PI),
      occupancy: getRandomElement(['low', 'medium', 'high']),
      progress,
      stops: generateStops(origin, destination)
    });
  }
  return trains;
};

export const updateTrains = (trains: Train[]): Train[] => {
  return trains.map(train => {
    const origin = STATIONS.find(s => s.id === train.originId)!;
    const destination = STATIONS.find(s => s.id === train.destinationId)!;
    
    // Increment progress slowly
    let newProgress = train.progress + 0.0005; 
    
    // Reset if reached destination
    let newOrigin = origin;
    let newDestination = destination;
    if (newProgress >= 1) {
      newProgress = 0;
      newOrigin = destination;
      newDestination = getRandomElement(STATIONS.filter(s => s.id !== newOrigin.id));
    }

    const currentLat = newOrigin.lat + (newDestination.lat - newOrigin.lat) * newProgress;
    const currentLng = newOrigin.lng + (newDestination.lng - newOrigin.lng) * newProgress;
    
    return {
      ...train,
      originId: newOrigin.id,
      destinationId: newDestination.id,
      progress: newProgress,
      currentLat,
      currentLng,
      heading: Math.atan2(newDestination.lng - newOrigin.lng, newDestination.lat - newOrigin.lat) * (180 / Math.PI)
    };
  });
};
