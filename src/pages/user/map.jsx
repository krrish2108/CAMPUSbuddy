import { useState } from 'react';
import ModuleLayout from '@/components/ModuleLayout';
import Campus3DEngine from '@/components/map/Campus3DEngine';
import BuildingBottomSheet from '@/components/map/BuildingBottomSheet';
import { BUILDINGS, MARKERS, FRIEND_LOCATIONS } from '@/data/mapData';
import { useUserArena } from '@/context/user/UserArenaContext';
import { useUserCaffinity } from '@/context/user/UserCaffinityContext';
import { Search, Layers, Navigation2, Scan, Zap, Users, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapPage() {
  const { orders } = useUserCaffinity();
  
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeFloor, setActiveFloor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState(['buildings', 'friends', 'events', 'canteen']);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Dynamic Canteen Status based on Orders
  const canteenMarkers = MARKERS.map(m => {
    if (m.type === 'cafeteria') {
      const activeOrders = orders.filter(o => o.status !== 'Done').length;
      return {
        ...m,
        status: activeOrders > 20 ? 'high-traffic' : activeOrders > 10 ? 'busy' : 'available',
        pulseColor: activeOrders > 20 ? 'red' : activeOrders > 10 ? 'orange' : 'green'
      };
    }
    return m;
  });

  const toggleLayer = (layer) => {
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const handleBuildingClick = (b) => {
    setSelectedBuilding(b);
    setActiveFloor(null); // Reset floor on new building selection
  };

  return (
    <ModuleLayout 
      title="Campus OS Map" 
      subtitle="Interact with 3D buildings and live markers" 
      color="#3b82f6"
    >
      <div className="relative h-[calc(100vh-200px)] w-full overflow-hidden rounded-[40px] bg-[#020617] border-4 border-slate-800 shadow-inner">
        
        {/* TOP OVERLAY - SEARCH & LAYERS */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-6 flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search rooms, labs, blocks..." 
              className="w-full pl-16 pr-6 py-4 bg-slate-900/80 backdrop-blur-xl border-2 border-white/5 rounded-3xl text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 shadow-2xl placeholder:text-slate-600"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className={`h-14 w-14 rounded-3xl flex items-center justify-center transition-all border-2 ${
                showLayerMenu ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900/80 border-white/5 text-slate-400 backdrop-blur-xl'
              }`}
            >
              <Layers size={22} />
            </button>

            <AnimatePresence>
              {showLayerMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-full right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[30px] p-6 shadow-2xl z-50 space-y-4"
                >
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Map Layers</p>
                  <div className="space-y-2">
                    {[
                      { id: 'buildings', label: 'Buildings', icon: <Scan size={14} />, color: 'blue' },
                      { id: 'canteen', label: 'Canteen Traffic', icon: <Navigation2 size={14} />, color: 'green' },
                      { id: 'events', label: 'Live Events', icon: <Zap size={14} />, color: 'orange' },
                      { id: 'friends', label: 'Friends', icon: <Users size={14} />, color: 'purple' }
                    ].map(layer => (
                      <button 
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                          activeLayers.includes(layer.id) ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={activeLayers.includes(layer.id) ? `text-${layer.color}-500` : ''}>{layer.icon}</span>
                          <span className="text-xs font-bold">{layer.label}</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${activeLayers.includes(layer.id) ? 'bg-blue-600' : 'bg-slate-800'}`}>
                          <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${activeLayers.includes(layer.id) ? 'left-5' : 'left-1'}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3D ENGINE COMPONENT */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
           <Campus3DEngine 
             onBuildingClick={handleBuildingClick}
             selectedBuildingId={selectedBuilding?.id}
             viewInteriorFloor={activeFloor}
           />
        </div>

        {/* BOTTOM SHEET */}
        <AnimatePresence>
          {selectedBuilding && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setSelectedBuilding(null); setActiveFloor(null); }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              />
              <BuildingBottomSheet 
                building={selectedBuilding} 
                activeFloor={activeFloor}
                onFloorChange={setActiveFloor}
                onClose={() => { setSelectedBuilding(null); setActiveFloor(null); }} 
              />
            </>
          )}
        </AnimatePresence>

        {/* WATERMARK */}
        <div className="absolute bottom-6 right-10 pointer-events-none text-right">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">KARNAVATI 3D ENGINE v2.0</p>
          <p className="text-[8px] font-bold text-blue-500/30 uppercase tracking-[0.2em] mt-1 italic">Procedural Mesh Generation Active</p>
        </div>

        {/* CONTROLS OVERLAY - RIGHT SIDE */}
        <div className="absolute bottom-10 right-10 z-[80] flex flex-col gap-3">
           <button 
             onClick={() => { setSelectedBuilding(null); setActiveFloor(null); }}
             className="w-14 h-14 bg-white text-slate-900 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
           >
             <RotateCcw size={24} />
           </button>
        </div>
      </div>
    </ModuleLayout>
  );
}
