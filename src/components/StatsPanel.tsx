"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { GeoNode, LatencyLink } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Clock, Share2, Globe, Laptop } from 'lucide-react';

interface StatsPanelProps {
  selectedNode: GeoNode | null;
  links: LatencyLink[];
  className?: string;
  onClose: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ selectedNode, links, className, onClose }) => {
  const [timeRange, setTimeRange] = useState('1h');

  const connectedLinks = useMemo(() => {
    if (!selectedNode) return [];
    return links.filter(
      l => l.source === selectedNode.id || l.target === selectedNode.id
    );
  }, [links, selectedNode]);

  const primaryLink = useMemo(() => connectedLinks[0], [connectedLinks]);

  const timeFormatter = useCallback(
    (timestamp: number) => {
      const d = new Date(timestamp);

      if (timeRange === '7d') {
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }

      return d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    [timeRange]
  );

  const chartData = useMemo(() => {
    if (!primaryLink || !primaryLink.history) return [];

    let points = primaryLink.history;

    if (timeRange === '1h') points = points.slice(-20);
    else if (timeRange === '24h') points = points.slice(-50);

    return points.map(p => ({
      time: timeFormatter(p.timestamp),
      latency: Math.round(p.value),
    }));
  }, [primaryLink, timeRange, timeFormatter]);

  const avgLatency = useMemo(() => {
    if (!primaryLink || primaryLink.history.length === 0) return 0;

    const sum = primaryLink.history.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / primaryLink.history.length);
  }, [primaryLink]);

  const currentLinkLatency = primaryLink ? Math.round(primaryLink.latencyMs) : 0;
  const clientLatency = selectedNode?.clientLatency;

  if (!selectedNode) {
    return (
      <div className={`bg-slate-900/90 backdrop-blur-lg border-l border-slate-700 text-white p-6 w-80 flex flex-col items-center justify-center text-center ${className}`}>
        <div className="bg-slate-800 p-4 rounded-full mb-4">
          <MapPin size={32} className="text-slate-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Select a Node</h2>
        <p className="text-sm text-slate-400">
          Click any exchange or region marker on the globe to view real-time latency statistics.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/90 backdrop-blur-lg border-l border-slate-700 text-white flex flex-col w-96 h-full overflow-y-auto ${className}`}>

      <div className="p-6 border-b border-slate-800 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold">{selectedNode.name}</h2>

        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedNode.status === 'operational'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-red-500/20 text-red-400'
          }`}>
            {selectedNode.status}
          </span>
          <span className="text-xs text-slate-400">{selectedNode.provider}</span>
        </div>

        <div className="text-xs text-slate-500 font-mono mt-2 flex items-center gap-1">
          <MapPin size={12} />
          {selectedNode.regionCode} • {selectedNode.lat.toFixed(2)}, {selectedNode.lng.toFixed(2)}
        </div>
      </div>

      {clientLatency !== undefined && (
        <div className="px-6 pt-6 pb-2">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                <Laptop size={12} /> Client → Node
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-mono font-bold ${clientLatency > 200 ? 'text-yellow-400' : 'text-white'}`}>
                {clientLatency}
              </span>
              <span className="text-slate-400 text-sm">ms</span>
            </div>

            <div className="text-[10px] text-slate-500 mt-1">
              Real-time RTT from your browser
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 p-6 border-b border-slate-800">
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Globe size={12} />
            Mesh Latency
          </div>
          <div className={`text-2xl font-mono font-bold ${
            currentLinkLatency > 150 ? 'text-red-400' :
            currentLinkLatency > 100 ? 'text-yellow-400' :
            'text-emerald-400'
          }`}>
            {currentLinkLatency}ms
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Clock size={12} />
            Avg (Last 1h)
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400">
            {avgLatency}ms
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 min-h-[300px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Latency History</h3>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
          </select>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} unit="ms" />

                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />

                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#38bdf8' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No active link data
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-sm mb-3">Active Connections</h3>

          <div className="space-y-2">
            {connectedLinks.map(link => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded border border-slate-700/50 hover:bg-slate-800/50 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-300">
                    {link.source === selectedNode.id ? link.target : link.source}
                  </span>
                  <span className="text-[10px] text-slate-500">Direct Route</span>
                </div>

                <span className={`text-sm font-mono font-bold ${
                  link.latencyMs > 150 ? 'text-red-400' :
                  link.latencyMs > 100 ? 'text-yellow-400' :
                  'text-emerald-400'
                }`}>
                  {Math.round(link.latencyMs)}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2">
          <Share2 size={16} />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;
