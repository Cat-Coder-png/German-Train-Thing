
import React from 'react';
import { Search, Train as TrainIcon, Filter, Clock, CheckCircle, Users, RefreshCw } from 'lucide-react';
import { Train, TrainType } from '../types.ts';
import { TRAIN_TYPES, TRAIN_COLORS } from '../constants.ts';

interface SidebarProps {
  trains: Train[];
  onSelectTrain: (train: Train) => void;
  selectedType: TrainType | 'ALL';
  setSelectedType: (type: TrainType | 'ALL') => void;
  statusFilter: 'ALL' | 'ON_TIME' | 'DELAYED';
  setStatusFilter: (status: 'ALL' | 'ON_TIME' | 'DELAYED') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  trains, 
  onSelectTrain, 
  selectedType, 
  setSelectedType,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onRefresh
}) => {
  const getOccupancyColor = (occupancy: Train['occupancy']) => {
    switch (occupancy) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
            <TrainIcon className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Casey's ZugRadar <span className="text-red-500 font-light italic">Live</span></h1>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors w-4 h-4" />
          <input
            type="text"
            placeholder="Train number or Station ID..."
            className="w-full bg-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 border-b border-slate-800 space-y-4 bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Filter className="w-3 h-3" />
            Filter Train Type
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                selectedType === 'ALL' ? 'bg-white text-slate-950 border-white' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              ALL
            </button>
            {TRAIN_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  selectedType === type ? 'text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
                style={selectedType === type ? { backgroundColor: TRAIN_COLORS[type] } : {}}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            Punctuality Status
          </div>
          <div className="flex gap-2">
            {[
              { id: 'ALL', label: 'All', icon: Filter },
              { id: 'ON_TIME', label: 'On Time', icon: CheckCircle },
              { id: 'DELAYED', label: 'Delayed', icon: Clock }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all border ${
                  statusFilter === item.id 
                    ? 'bg-slate-700 text-white border-slate-600 shadow-inner' 
                    : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600'
                }`}
              >
                <item.icon className={`w-3 h-3 ${statusFilter === item.id ? (item.id === 'DELAYED' ? 'text-red-500' : 'text-green-500') : ''}`} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="flex items-center justify-between px-2 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>{trains.length} Result{trains.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-red-500">REALTIME</span>
             </div>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onRefresh();
               }}
               className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-500 transition-all active:rotate-180 duration-500"
               title="Force Update Simulation"
             >
                <RefreshCw className="w-3 h-3" />
             </button>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {trains.map(train => (
            <button
              key={train.id}
              onClick={() => onSelectTrain(train)}
              className="w-full group flex flex-col p-3 rounded-xl hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700 text-left active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded shadow-sm" style={{ backgroundColor: `${TRAIN_COLORS[train.type]}33`, color: TRAIN_COLORS[train.type] }}>
                    {train.number}
                  </span>
                  <div className={`flex items-center gap-0.5 ${getOccupancyColor(train.occupancy)}`} title={`Occupancy: ${train.occupancy}`}>
                    <Users className="w-3 h-3" />
                    <div className="flex gap-0.5">
                      <div className="w-1 h-2 rounded-sm bg-current" />
                      <div className={`w-1 h-2 rounded-sm ${train.occupancy === 'low' ? 'opacity-20' : 'bg-current'}`} />
                      <div className={`w-1 h-2 rounded-sm ${train.occupancy !== 'high' ? 'opacity-20' : 'bg-current'}`} />
                    </div>
                  </div>
                </div>
                {train.delay > 0 ? (
                  <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                    +{train.delay}m
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                    On Time
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex flex-col">
                  <span className="text-slate-300 font-medium">{train.originId}</span>
                </div>
                <div className="h-[1px] flex-1 mx-3 bg-slate-700 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-slate-300 font-medium">{train.destinationId}</span>
                </div>
              </div>
            </button>
          ))}
          {trains.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-slate-600 mb-2 font-bold uppercase text-xs">No Trains Found</div>
              <p className="text-[10px] text-slate-700">Adjust filters or search query</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center justify-between text-slate-500">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             DB Network API
          </div>
          <span className="text-[10px] font-mono">v3.1.2</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
