'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar, selectNode } from '@/store/slices/uiSlice';
import { useSimulation } from '@/hooks/useSimulation';
import GlobeWrapper from '@/components/GlobeWrapper';
import ControlPanel from '@/components/ControlPanel';
import StatsPanel from '@/components/StatsPanel';

const App: React.FC = () => {
  const dispatch = useDispatch();
  
  // Use Custom Hook for Simulation Logic
  useSimulation();

  // Selectors
  const { isSidebarOpen, selectedNodeId, theme } = useSelector((state: RootState) => state.ui);
  const { nodes, links } = useSelector((state: RootState) => state.topology);
  const selectedNode = selectedNodeId ? nodes.find((node) => node.id === selectedNodeId) ?? null : null;

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="relative w-screen h-screen bg-white dark:bg-black overflow-hidden font-sans transition-colors duration-300">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <GlobeWrapper />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex">
        
        {/* Left Sidebar */}
        <div className={`pointer-events-auto h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <ControlPanel />
        </div>
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="pointer-events-auto absolute top-4 left-4 z-50 p-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 md:hidden shadow-lg"
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>

        {/* Main Content Area */}
        <div className="flex-1 relative"></div>

        {/* Right Sidebar (Stats) */}
        <div className={`pointer-events-auto h-full transition-transform duration-300 ease-in-out ${selectedNodeId ? 'translate-x-0' : 'translate-x-full'} absolute right-0 md:relative md:translate-x-0`}>
           <StatsPanel
             selectedNode={selectedNode}
             links={links}
             onClose={() => dispatch(selectNode(null))}
             className="h-full"
           />
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white/90 dark:bg-slate-900/80 backdrop-blur px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 pointer-events-none hidden md:flex gap-6 text-xs text-slate-600 dark:text-slate-300 shadow-lg">
         <div className="flex items-center gap-2">
           <div className="w-3 h-1 bg-[#00FF00] rounded-full shadow-[0_0_5px_#00FF00]"></div>
           <span>&lt; 120ms (Low)</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-1 bg-[#FFD700] rounded-full shadow-[0_0_5px_#FFD700]"></div>
           <span>120-250ms (Med)</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-1 bg-[#FF0000] rounded-full shadow-[0_0_5px_#FF0000]"></div>
           <span>&gt; 250ms (High)</span>
         </div>
      </div>
    </div>
  );
};

export default App;