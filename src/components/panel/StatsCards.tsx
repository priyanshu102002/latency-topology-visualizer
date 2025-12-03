import React from "react";
import { Clock, Globe } from "lucide-react";
import { getLatencyColor } from "../../lib/latencyUtils";

interface StatsCardsProps {
  currentLatency: number;
  avgLatency: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  currentLatency,
  avgLatency,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 pt-6 px-6">
      <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-300 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs mb-1">
          <Globe size={12} />
          Mesh Latency
        </div>
        <div className={`text-2xl font-mono font-bold ${getLatencyColor(currentLatency)}`}>
          {currentLatency}ms
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-300 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs mb-1">
          <Clock size={12} />
          Avg (Last 1h)
        </div>
        <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
          {avgLatency}ms
        </div>
      </div>
    </div>
  );
};

