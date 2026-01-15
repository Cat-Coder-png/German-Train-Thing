
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Train, TrainType, NetworkStatus } from './types';
import { generateInitialTrains, updateTrains } from './utils/simulation';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import TrainDetails from './components/TrainDetails';
import AIConsole from './components/AIConsole';
import { GeminiRailService } from './services/geminiService';
import { Globe, Activity, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TrainType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ON_TIME' | 'DELAYED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    totalTrains: 0,
    onTimePercentage: 92.4,
    majorDisruptions: [],
    activeAlerts: 3
  });
  const [analysisText, setAnalysisText] = useState('Initializing rail intelligence systems...');
  
  const gemini = useRef(new GeminiRailService());

  // Memoized filtered trains for consistency across components
  const filteredTrains = useMemo(() => {
    return trains.filter(t => {
      const matchesType = selectedType === 'ALL' || t.type === selectedType;
      const matchesStatus = statusFilter === 'ALL' || 
                           (statusFilter === 'DELAYED' ? t.delay > 0 : t.delay === 0);
      const q = searchQuery.toLowerCase();
      const matchesSearch = t.number.toLowerCase().includes(q) ||
                          t.originId.toLowerCase().includes(q) ||
                          t.destinationId.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [trains, selectedType, statusFilter, searchQuery]);

  const selectedTrain = trains.find(t => t.id === selectedTrainId) || null;

  // Initialize and update loop
  useEffect(() => {
    const initial = generateInitialTrains(50);
    setTrains(initial);
    setNetworkStatus(prev => ({ ...prev, totalTrains: initial.length }));

    const interval = setInterval(() => {
      setTrains(prev => updateTrains(prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = useCallback(() => {
    setTrains(prev => updateTrains(prev));
  }, []);

  // Periodic AI Analysis
  useEffect(() => {
    const fetchAnalysis = async () => {
      const text = await gemini.current.analyzeNetworkStatus(trains, networkStatus);
      setAnalysisText(text);
    };

    if (trains.length > 0) {
      fetchAnalysis();
    }
    
    const analysisInterval = setInterval(fetchAnalysis, 60000);
    return () => clearInterval(analysisInterval);
  }, [trains.length]);

  const handleSelectTrain = useCallback((train: Train) => {
    setSelectedTrainId(train.id);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden select-none">
      <Sidebar 
        trains={filteredTrains} 
        onSelectTrain={handleSelectTrain}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={handleManualRefresh}
      />

      <main className="flex-1 relative flex flex-col">
        {/* Top Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-6 max-w-xl">
              <div className="flex items-center gap-3 pr-6 border-r border-slate-800">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network Live</div>
                  <div className="text-sm font-bold text-white whitespace-nowrap">{trains.length} Trains Active</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">AI Status Report</div>
                  <div className="text-xs text-slate-300 leading-relaxed max-w-md line-clamp-2">
                    {analysisText}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 shadow-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">System Operational</span>
            </div>
            <button 
              onClick={handleManualRefresh}
              className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-xl text-slate-400 hover:text-white transition-colors active:rotate-180 duration-500"
              title="Refresh Simulation"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map UI */}
        <MapView 
            trains={filteredTrains} 
            selectedTrain={selectedTrain}
            onSelectTrain={handleSelectTrain}
        />

        {/* Floating Details Panel */}
        {selectedTrain && (
          <TrainDetails 
            train={selectedTrain} 
            onClose={() => setSelectedTrainId(null)} 
          />
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-6 left-6 z-10 flex gap-4 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3 shadow-xl flex items-center gap-4 pointer-events-auto">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ICE</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">RE/RB</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">S-Bahn</span>
                </div>
            </div>
        </div>

        {/* AI Assistant */}
        <AIConsole trains={trains} networkStatusText={analysisText} />
      </main>
    </div>
  );
};

export default App;
