
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Train, Station } from '../types';
import { STATIONS, TRAIN_COLORS } from '../constants';

interface MapViewProps {
  trains: Train[];
  selectedTrain: Train | null;
  onSelectTrain: (train: Train) => void;
}

const MapView: React.FC<MapViewProps> = ({ trains, selectedTrain, onSelectTrain }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const trainMarkersRef = useRef<Record<string, L.Marker>>({});
  const stationMarkersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [51.1657, 10.4515], // Center of Germany
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Dark mode tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    // Add stations
    STATIONS.forEach(station => {
      const marker = L.circleMarker([station.lat, station.lng], {
        radius: station.isHub ? 6 : 3,
        fillColor: '#64748b',
        color: '#1e293b',
        weight: 2,
        fillOpacity: 0.8
      }).addTo(map);
      
      marker.bindTooltip(station.name, { 
        permanent: false, 
        direction: 'top',
        className: 'bg-slate-900 text-white border-none rounded px-2 py-1 text-xs shadow-xl'
      });
      
      stationMarkersRef.current[station.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update train positions
  useEffect(() => {
    if (!mapRef.current) return;

    trains.forEach(train => {
      const color = TRAIN_COLORS[train.type];
      
      if (!trainMarkersRef.current[train.id]) {
        // Create new marker
        const trainIcon = L.divIcon({
          className: 'train-icon-container',
          html: `
            <div style="
              width: 14px; 
              height: 14px; 
              background-color: ${color}; 
              border: 2px solid white; 
              border-radius: 50%;
              transform: rotate(${train.heading}deg);
              box-shadow: 0 0 10px ${color};
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 0; 
                height: 0; 
                border-left: 3px solid transparent;
                border-right: 3px solid transparent;
                border-bottom: 5px solid white;
                margin-top: -2px;
              "></div>
            </div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([train.currentLat, train.currentLng], { 
          icon: trainIcon,
          zIndexOffset: train.type === 'ICE' ? 1000 : 500
        }).addTo(mapRef.current!);

        marker.on('click', () => onSelectTrain(train));
        trainMarkersRef.current[train.id] = marker;
      } else {
        // Update existing marker
        const marker = trainMarkersRef.current[train.id];
        marker.setLatLng([train.currentLat, train.currentLng]);
        
        // Update icon orientation
        const icon = marker.getIcon() as L.DivIcon;
        marker.setIcon(L.divIcon({
          ...icon.options,
          html: icon.options.html?.replace(/rotate\(.*deg\)/, `rotate(${train.heading}deg)`)
        }));
      }
    });

    // Cleanup old trains
    Object.keys(trainMarkersRef.current).forEach(id => {
      if (!trains.find(t => t.id === id)) {
        trainMarkersRef.current[id].remove();
        delete trainMarkersRef.current[id];
      }
    });
  }, [trains, onSelectTrain]);

  // Handle selected train styling
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Reset all markers
    Object.values(trainMarkersRef.current).forEach(marker => {
        const element = marker.getElement();
        if (element) element.classList.remove('pulse');
    });

    if (selectedTrain && trainMarkersRef.current[selectedTrain.id]) {
      const marker = trainMarkersRef.current[selectedTrain.id];
      marker.getElement()?.classList.add('pulse');
      mapRef.current.flyTo([selectedTrain.currentLat, selectedTrain.currentLng], 9, {
        duration: 1
      });
    }
  }, [selectedTrain]);

  return <div ref={mapContainerRef} className="flex-1 w-full h-full" />;
};

export default MapView;
