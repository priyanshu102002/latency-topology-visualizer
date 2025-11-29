import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { selectNode } from '../../store/slices/uiSlice';
import { GeoNode, LatencyLink } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Clock, Share2, Globe, Laptop } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface StatsPanelProps {
  className?: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ className }) => {
  const dispatch = useDispatch();
  const selectedNodeId = useSelector((state: RootState) => state.ui.selectedNodeId);
  const nodes = useSelector((state: RootState) => state.topology.nodes);
  const links = useSelector((state: RootState) => state.topology.links);
  const [timeRange, setTimeRange] = useState('1h');

  // Derive selection from store data
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null;

  if (!selectedNode) {
    return (
      <div className={`bg-slate-900/90 dark:bg-slate-900/90 bg-white/90 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-6 w-80 flex flex-col items-center justify-center text-center ${className}`}>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
          <MapPin size={32} className="text-slate-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Select a Node</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Click on any marker on the globe to view real-time statistics.
        </p>
      </div>
    );
  }

  const handleClose = () => dispatch(selectNode(null));

  // Connections and Chart Data
  const connectedLinks = links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id);
  const primaryLink = connectedLinks[0];
  
  let chartData: any[] = [];
  if (primaryLink) {
    let dataPoints = primaryLink.history;
    if (timeRange === '1h') dataPoints = primaryLink.history.slice(-20);
    else if (timeRange === '24h') dataPoints = primaryLink.history.slice(-50);
    
    chartData = dataPoints.map(h => ({
      time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latency: Math.round(h.value)
    }));
  }

  const avgLatency = primaryLink 
    ? Math.round(primaryLink.history.reduce((acc, curr) => acc + curr.value, 0) / primaryLink.history.length)
    : 0;

  const currentLinkLatency = primaryLink ? Math.round(primaryLink.latencyMs) : 0;
  const clientLatency = selectedNode.clientLatency;

  return (
    <div className={`bg-slate-900/90 dark:bg-slate-900/90 bg-white/90 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex flex-col w-96 h-full overflow-y-auto ${className}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 relative">
        <Button variant="ghost" size="sm" onClick={handleClose} className="absolute top-4 right-4 text-slate-400">
          &times;
        </Button>
        <div className="mb-2">
          <h2 className="text-2xl font-bold">{selectedNode.name}</h2>
          <div className="flex items-center gap-2 mt-1">
             <Badge variant={selectedNode.status === 'operational' ? 'default' : 'destructive'}>
               {selectedNode.status}
             </Badge>
             <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">{selectedNode.provider}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono mt-2 flex items-center gap-1">
          <MapPin size={12} />
          {selectedNode.regionCode} • {selectedNode.lat.toFixed(2)}, {selectedNode.lng.toFixed(2)}
        </div>
      </div>

      {/* Real-time Measurements */}
      {clientLatency !== undefined && (
        <div className="px-6 pt-6 pb-2">
          <Card className="bg-blue-50 dark:bg-slate-800/80 border-blue-200 dark:border-blue-500/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                   <Laptop size={12} /> Client (You) → Node
                 </div>
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                 </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-mono font-bold ${clientLatency > 200 ? 'text-yellow-500' : 'text-slate-900 dark:text-white'}`}>
                  {clientLatency}
                </span>
                <span className="text-slate-500 text-sm">ms</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 p-6 border-b border-slate-200 dark:border-slate-800">
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Globe size={12} /> Mesh Latency
            </div>
            <div className={`text-2xl font-mono font-bold ${
              currentLinkLatency > 250 ? 'text-red-500' : currentLinkLatency > 120 ? 'text-yellow-500' : 'text-emerald-500'
            }`}>
              {currentLinkLatency}ms
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Clock size={12} /> Avg (1h)
            </div>
            <div className="text-2xl font-mono font-bold text-blue-500">
              {avgLatency}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="p-6 flex-1 min-h-[300px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Latency History</h3>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded px-2 py-1 outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
          </select>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} unit="ms" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Line type="monotone" dataKey="latency" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Connections List */}
        <div className="mt-6">
          <h3 className="font-semibold text-sm mb-3">Active Connections</h3>
          <div className="space-y-2">
            {connectedLinks.map(link => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{link.source === selectedNode.id ? link.target : link.source}</span>
                  <span className="text-xs text-slate-500">Direct Route</span>
                </div>
                <div className={`text-sm font-mono font-bold ${
                  link.latencyMs > 250 ? 'text-red-500' : link.latencyMs > 120 ? 'text-yellow-500' : 'text-emerald-500'
                }`}>
                  {Math.round(link.latencyMs)}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white gap-2">
          <Share2 size={16} /> Export Report
        </Button>
      </div>
    </div>
  );
};

export default StatsPanel;