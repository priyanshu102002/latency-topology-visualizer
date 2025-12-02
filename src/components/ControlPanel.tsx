"use client";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloudProvider } from "@/types";
import { PROVIDER_COLORS } from "@/data/constants";
import {
  updateFilter,
  toggleProvider as toggleProviderAction,
} from "@/store/slices/uiSlice";
import { RootState } from "@/store";
import { Layers, Server, Wifi, Filter, Search, Activity, History } from "lucide-react";

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.ui.filters);

  const toggleProvider = useCallback(
    (provider: CloudProvider) => {
      dispatch(toggleProviderAction(provider));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (partial: Partial<typeof filters>) => {
      dispatch(updateFilter(partial));
    },
    [dispatch]
  );

  return (
    <div
      className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-6 flex flex-col gap-6 overflow-y-auto w-80 h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wifi size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">
              Latency
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Visualizer
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
          placeholder="Search node..."
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Layers Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
          <Layers size={16} />
          LAYERS
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="text-sm">Show Exchanges</span>
            <input
              type="checkbox"
              checked={filters.showExchanges}
              onChange={(e) =>
                updateFilters({ showExchanges: e.target.checked })
              }
              className="accent-blue-500 h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="text-sm">Show Cloud Regions</span>
            <input
              type="checkbox"
              checked={filters.showRegions}
              onChange={(e) => updateFilters({ showRegions: e.target.checked })}
              className="accent-blue-500 h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* Visualization Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
          <Activity size={16} />
          VISUALIZATION
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-slate-400" />
              <span className="text-sm">Real-time Connections</span>
            </div>
            <input
              type="checkbox"
              checked={filters.showRealTime}
              onChange={(e) =>
                updateFilters({ showRealTime: e.target.checked })
              }
              className="accent-blue-500 h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2">
              <History size={14} className="text-slate-400" />
              <span className="text-sm">Historical Data</span>
            </div>
            <input
              type="checkbox"
              checked={filters.showHistorical}
              onChange={(e) =>
                updateFilters({ showHistorical: e.target.checked })
              }
              className="accent-blue-500 h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* Providers Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
          <Server size={16} />
          PROVIDERS
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {(
            Object.keys(CloudProvider) as Array<keyof typeof CloudProvider>
          ).map((key) => {
            const provider = CloudProvider[key] as CloudProvider;
            const isActive = filters.providers[provider];
            return (
              <button
                key={provider}
                onClick={() => toggleProvider(provider)}
                className={`flex items-center justify-between p-2 px-3 rounded-lg text-sm border transition-all ${
                  isActive
                    ? "bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white"
                    : "bg-transparent border-transparent text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: PROVIDER_COLORS[provider] }}
                  />
                  {provider}
                </div>
                <div
                  className={`w-8 h-4 rounded-full relative transition-colors ${
                    isActive ? "bg-blue-600" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                      isActive ? "translate-x-4" : ""
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Latency Threshold */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
          <Filter size={16} />
          LATENCY FILTER
        </h3>
        <div className="px-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span>0ms</span>
            <span>{filters.maxLatency}ms+</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            value={filters.maxLatency}
            onChange={(e) =>
              updateFilters({ maxLatency: Number(e.target.value) })
            }
            className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
