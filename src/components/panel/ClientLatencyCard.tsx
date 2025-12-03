import React from "react";
import { Laptop } from "lucide-react";
import { getClientLatencyColor } from "../../lib/latencyUtils";

interface ClientLatencyCardProps {
  latency: number;
}

export const ClientLatencyCard: React.FC<ClientLatencyCardProps> = ({
  latency,
}) => {
  return (
    <div className="px-6 pt-6 pb-2">
      <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-lg border border-blue-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
            <Laptop size={12} /> Client → Node
          </div>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className={`text-3xl font-mono font-bold ${getClientLatencyColor(latency)}`}
          >
            {latency}
          </span>
          <span className="text-slate-600 dark:text-slate-400 text-sm">ms</span>
        </div>

        <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
          Real-time RTT from your browser
        </div>
      </div>
    </div>
  );
};

