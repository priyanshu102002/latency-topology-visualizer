import React from "react";
import { LatencyLink } from "@/types";
import { getLatencyColor } from "../../lib/latencyUtils";

interface ConnectionsListProps {
  connections: LatencyLink[];
  selectedNodeId: string;
}

export const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connections,
  selectedNodeId,
}) => {
  return (
    <div className="p-6">
      <div className="mt-6">
        <h3 className="font-semibold text-sm mb-3">Active Connections</h3>

        <div className="space-y-2">
          {connections.map((link) => {
            const targetNodeId =
              link.source === selectedNodeId ? link.target : link.source;
            const latency = Math.round(link.latencyMs);

            return (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/30 rounded border border-slate-300 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {targetNodeId}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500">
                    Direct Route
                  </span>
                </div>

                <span
                  className={`text-sm font-mono font-bold ${getLatencyColor(latency)}`}
                >
                  {latency}ms
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

