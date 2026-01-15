
import React, { useState, useMemo } from 'react';
import { X, Clock, Users, ArrowRight, MapPin, Navigation, Share2, Gauge, Activity, Map as MapIcon, ChevronDown, ChevronUp, Building2, Globe } from 'lucide-react';
import { Train, Station } from '../types.ts';
import { TRAIN_COLORS, STATIONS } from '../constants.ts';

interface TrainDetailsProps {
  train: Train;
  onClose: () => void;
}

// Haversine formula to calculate distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const StationCard: React.FC<{ label: string; station?: Station }> = ({ label, station }) => {
  if (!station) return null;
  return (
    <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        {station.isHub && (
          <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase">Major Hub</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-bold text-white">{station.name}</span>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {station.lat.toFixed(4)}°N
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {station.lng.toFixed(4)}°E
        </div>
      </div>
    </div>
  );
};

const TrainDetails: React.FC<TrainDetailsProps> = ({ train, onClose }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const origin = STATIONS.find(s => s.id === train.originId);
  const destination = STATIONS.find(s => s.id === train.destinationId);
  
  const analysisMetrics = useMemo(() => {
    if (!origin || !destination) return null;
    const totalDist = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    const avgSpeed = train.speed * (0.9 + Math.random() * 0.15); // Simulated variation
    const stopsCount = train.stops.length;
    const remainingDist = totalDist * (1 - train.progress);
    
    return {
      totalDistance: totalDist.toFixed(1),
      avgSpeed: avgSpeed.toFixed(1),
      stopsCount,
      remainingDistance: remainingDist.toFixed(1),
    };
  }, [train, origin, destination]);

  const estimatedArrival = train.stops[1].arrivalTime;
  const progressPercent = Math.round(train.progress * 100);

  return (
    <div className="absolute right-4 top-4 w-96 max-h-[calc(100vh-2rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-10 duration-300 ring-1 ring-slate-800">
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-800/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white/10"
            style={{ backgroundColor: TRAIN_COLORS[train.type] }}
          >
            {train.type[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-black text-white leading-tight tracking-tight">{train.number}</h2>
               {train.delay === 0 && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">High Speed Express</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors group">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-black mb-1 group-hover:text-red-500 transition-colors">
              <Gauge className="w-3 h-3" />
              Live Speed
            </div>
            <div className="text-2xl font-mono font-black text-white">
                {Math.round(train.speed)} 
                <span className="text-xs font-medium text-slate-500 ml-1">km/h</span>
            </div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors group">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-black mb-1 group-hover:text-blue-400 transition-colors">
              <Users className="w-3 h-3" />
              Boarding
            </div>
            <div className="text-2xl font-black text-white capitalize">{train.occupancy}</div>
          </div>
        </div>

        {/* Journey Progress */}
        <div className="space-y-3">
           <div className="flex justify-between items-end text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Journey Progress</span>
              <span className="text-white">{progressPercent}%</span>
           </div>
           <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[2px]">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                style={{ width: `${progressPercent}%`, backgroundColor: TRAIN_COLORS[train.type] }}
              />
           </div>
           <div className="flex justify-between text-[10px] text-slate-600 font-medium">
              <span>{origin?.id}</span>
              <span>{destination?.id}</span>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="flex-1 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
            >
                <Activity className="w-4 h-4 text-blue-400" />
                {showAnalysis ? 'HIDE ANALYSIS' : 'ROUTE ANALYSIS'}
                {showAnalysis ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button className="flex-1 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold py-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95">
                <Share2 className="w-4 h-4" />
                SHARE TRIP
            </button>
        </div>

        {/* Analysis Panel */}
        {showAnalysis && analysisMetrics && (
          <div className="bg-slate-950/60 border border-slate-700/50 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top-4 duration-300">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Distance</div>
                   <div className="flex items-center gap-2 text-white font-mono text-sm">
                      <MapIcon className="w-3 h-3 text-emerald-500" />
                      {analysisMetrics.totalDistance} km
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Avg. Speed</div>
                   <div className="flex items-center gap-2 text-white font-mono text-sm">
                      <Navigation className="w-3 h-3 text-amber-500" />
                      {analysisMetrics.avgSpeed} km/h
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Stops</div>
                   <div className="flex items-center gap-2 text-white font-mono text-sm">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      {analysisMetrics.stopsCount}
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Remaining</div>
                   <div className="flex items-center gap-2 text-white font-mono text-sm">
                      <Activity className="w-3 h-3 text-red-500" />
                      {analysisMetrics.remainingDistance} km
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Station Details Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Building2 className="w-3 h-3 text-blue-500" />
            Station Data
          </h3>
          <div className="space-y-2">
            <StationCard label="Origin Station" station={origin} />
            <StationCard label="Destination Station" station={destination} />
          </div>
        </div>

        {/* Detailed Route View */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Navigation className="w-3 h-3 text-red-500" />
            Route & Timeline
          </h3>
          
          <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-slate-700 before:via-slate-800 before:to-slate-700">
             {/* Origin */}
             <div className="relative">
                <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-slate-600 z-10" />
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-sm font-bold text-white leading-none mb-1">{origin?.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Dept {train.stops[0].departureTime} • PL {train.stops[0].platform}</div>
                    </div>
                </div>
             </div>
             
             {/* Dynamic Current Leg */}
             <div className="relative">
                <div className="absolute -left-[30px] -top-1 w-5 h-5 rounded-full bg-red-600/20 border-2 border-red-500 z-10 animate-pulse flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-sm font-bold text-red-500 leading-none mb-1">In Transit</div>
                        <div className="text-[10px] text-slate-400">Next Stop: {destination?.name}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-mono font-bold text-white leading-none mb-1">ETA {estimatedArrival}</div>
                        <div className={`text-[10px] font-bold uppercase ${train.delay > 0 ? 'text-red-500' : 'text-green-500'}`}>
                           {train.delay > 0 ? `+${train.delay}m Delay` : 'Punctual'}
                        </div>
                    </div>
                </div>
             </div>

             {/* Destination */}
             <div className="relative opacity-50">
                <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-slate-600 z-10" />
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-sm font-bold text-white leading-none mb-1">{destination?.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Arr {train.stops[1].arrivalTime} • PL {train.stops[1].platform}</div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
            <button className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-3 rounded-xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95">
                BOOK TICKETS
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center gap-2">
         <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
         </div>
         <span className="text-[10px] text-slate-500 font-bold uppercase truncate">Tracking via European Rail Control (ERTMS)</span>
      </div>
    </div>
  );
};

export default TrainDetails;
