import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { updateFilter, toggleProvider } from "@/store/slices/uiSlice";
import { CloudProvider } from "@/types";

import SearchBox from "@/components/SearchBox";
import LayerToggles from "@/components/panels/LayerToggles";
import VisualizationToggles from "@/components/panels/VisualizationToggles";
import ProviderFilter from "@/components/panels/ProviderFilter";
import LatencySlider from "@/components/panels/LatencySlider";
import StatusFooter from "@/components/panels/StatusFooter";

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className }) => {
  const dispatch: AppDispatch = useDispatch();

  const filters = useSelector((state: RootState) => state.ui.filters);

  return (
    <div
      className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-6 flex flex-col gap-6 overflow-y-auto w-80 h-full ${className}`}
    >
      <SearchBox
        value={filters.searchQuery}
        onChange={(val: string) => dispatch(updateFilter({ searchQuery: val }))}
      />

      <LayerToggles
        showExchanges={filters.showExchanges}
        showRegions={filters.showRegions}
        onToggle={(obj: Partial<typeof filters>) => dispatch(updateFilter(obj))}
      />

      <VisualizationToggles
        showRealTime={filters.showRealTime}
        showHistorical={filters.showHistorical}
        onToggle={(obj: Partial<typeof filters>) => dispatch(updateFilter(obj))}
      />

      <ProviderFilter
        providers={filters.providers}
        toggleProvider={(provider: CloudProvider) =>
          dispatch(toggleProvider(provider))
        }
      />

      <LatencySlider
        maxLatency={filters.maxLatency}
        onChange={(val: number) => dispatch(updateFilter({ maxLatency: val }))}
      />

      <StatusFooter />
    </div>
  );
};

export default ControlPanel;
