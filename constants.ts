
import { Station, TrainType } from './types';

export const GERMANY_BOUNDS: [[number, number], [number, number]] = [
  [47.270111, 5.866315], // SW
  [55.099161, 15.041931]  // NE
];

export const STATIONS: Station[] = [
  { id: 'BER', name: 'Berlin Hbf', lat: 52.5251, lng: 13.3694, isHub: true },
  { id: 'HAM', name: 'Hamburg Hbf', lat: 53.5527, lng: 10.0065, isHub: true },
  { id: 'MUC', name: 'München Hbf', lat: 48.1402, lng: 11.5583, isHub: true },
  { id: 'FRA', name: 'Frankfurt (Main) Hbf', lat: 50.1065, lng: 8.6621, isHub: true },
  { id: 'CGN', name: 'Köln Hbf', lat: 50.9433, lng: 6.9592, isHub: true },
  { id: 'STR', name: 'Stuttgart Hbf', lat: 48.7841, lng: 9.1816, isHub: true },
  { id: 'LEI', name: 'Leipzig Hbf', lat: 51.3452, lng: 12.3821, isHub: true },
  { id: 'DUS', name: 'Düsseldorf Hbf', lat: 51.2199, lng: 6.7943, isHub: true },
  { id: 'NUE', name: 'Nürnberg Hbf', lat: 49.4452, lng: 11.0822, isHub: false },
  { id: 'BRE', name: 'Bremen Hbf', lat: 53.0835, lng: 8.8138, isHub: false },
  { id: 'HAN', name: 'Hannover Hbf', lat: 52.3766, lng: 9.7410, isHub: false },
  { id: 'DRE', name: 'Dresden Hbf', lat: 51.0406, lng: 13.7325, isHub: false },
];

export const TRAIN_TYPES: TrainType[] = ['ICE', 'IC', 'RE', 'RB', 'S-BAHN', 'NJ'];

export const TRAIN_COLORS: Record<TrainType, string> = {
  'ICE': '#ef4444', // Red
  'IC': '#fca5a5',  // Light Red
  'RE': '#3b82f6',  // Blue
  'RB': '#60a5fa',  // Light Blue
  'S-BAHN': '#10b981', // Green
  'NJ': '#6366f1',  // Indigo
};
