"use client";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloudProvider } from "@/types";
import {
  updateFilter,
  toggleProvider as toggleProviderAction,
} from "@/store/slices/uiSlice";
import { RootState } from "@/store";

import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import LayersSection from "@/components/LayersSection";
import VisualizationSection from "@/components/VisualizationSection";
import ProviderSection from "@/components/ProviderSection";
import LatencyThreshold from "@/components/LatencyThreshold";

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
      <Header />

      <SearchInput
        value={filters.searchQuery}
        onChange={(val) => updateFilters({ searchQuery: val })}
      />

      <LayersSection
        showExchanges={filters.showExchanges}
        showRegions={filters.showRegions}
        onToggle={(partial) => updateFilters(partial)}
      />

      <VisualizationSection
        showRealTime={filters.showRealTime}
        showHistorical={filters.showHistorical}
        onToggle={(partial) => updateFilters(partial)}
      />

      <ProviderSection
        activeProviders={filters.providers}
        onToggleProvider={toggleProvider}
      />

      <LatencyThreshold
        maxLatency={filters.maxLatency}
        onChange={(v) => updateFilters({ maxLatency: v })}
      />
    </div>
  );
};

export default ControlPanel;
