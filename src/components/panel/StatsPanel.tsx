"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GeoNode, LatencyLink } from "../../types";
import { exportLatencyReportToPDF } from "@/services/pdfExporter";
import { NodeHeader } from "./NodeHeader";
import { ClientLatencyCard } from "./ClientLatencyCard";
import { StatsCards } from "./StatsCards";
import { LatencyHistoryChart } from "./LatencyHistoryChart";
import { ConnectionsList } from "./ConnectionsList";
import { EmptyState } from "./EmptyState";
import { formatTime } from "@/lib/formatTime";

const TIME_RANGES = {
  ONE_HOUR: "1h",
  TWENTY_FOUR_HOURS: "24h",
  SEVEN_DAYS: "7d"
} as const;

const CHART_DATA_LIMITS = {
  [TIME_RANGES.ONE_HOUR]: 20,
  [TIME_RANGES.TWENTY_FOUR_HOURS]: 50,
} as const;

interface StatsPanelProps {
  selectedNode: GeoNode | null;
  links: LatencyLink[];
  className?: string;
  onClose: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  selectedNode,
  links,
  className,
  onClose,
}) => {
  const showHistorical = useSelector(
    (state: RootState) => state.ui.filters.showHistorical
  );
  const [timeRange, setTimeRange] = useState<string>(TIME_RANGES.ONE_HOUR);

  const connectedLinks = useMemo(() => {
    if (!selectedNode) return [];
    return links.filter(
      (link) => link.source === selectedNode.id || link.target === selectedNode.id
    );
  }, [links, selectedNode]);

  const primaryLink = useMemo(() => connectedLinks[0], [connectedLinks]);

  const timeFormatter = useCallback(
    (timestamp: number) => formatTime(timestamp, timeRange),
    [timeRange]
  );

  const chartData = useMemo(() => {
    if (!primaryLink?.history) return [];

    let points = primaryLink.history;
    const limit = CHART_DATA_LIMITS[timeRange as keyof typeof CHART_DATA_LIMITS];

    if (limit) {
      points = points.slice(-limit);
    }

    return points.map((point) => ({
      time: timeFormatter(point.timestamp),
      latency: Math.round(point.value),
    }));
  }, [primaryLink, timeRange, timeFormatter]);

  const avgLatency = useMemo(() => {
    if (!primaryLink?.history?.length) return 0;
    const sum = primaryLink.history.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / primaryLink.history.length);
  }, [primaryLink]);

  const currentLinkLatency = useMemo(
    () => (primaryLink ? Math.round(primaryLink.latencyMs) : 0),
    [primaryLink]
  );

  const exportToPDF = useCallback(() => {
    if (!selectedNode || !primaryLink) return;

    exportLatencyReportToPDF({
      selectedNode,
      primaryLink,
      connectedLinks,
      chartData,
      avgLatency,
      currentLinkLatency,
    });
  }, [
    selectedNode,
    primaryLink,
    connectedLinks,
    chartData,
    avgLatency,
    currentLinkLatency,
  ]);

  if (!selectedNode) {
    return <EmptyState className={className} />;
  }

  return (
    <div
      className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex flex-col w-96 h-full overflow-y-auto ${className}`}
    >
      <NodeHeader node={selectedNode} onClose={onClose} />

      {selectedNode.clientLatency !== undefined && (
        <ClientLatencyCard latency={selectedNode.clientLatency} />
      )}

      <StatsCards
        currentLatency={currentLinkLatency}
        avgLatency={avgLatency}
      />

      <div className="grid grid-cols-1 p-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={exportToPDF}
          className="border border-slate-300 dark:border-slate-700 rounded-lg p-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 text-slate-900 dark:text-white"
          title="Export Report as PDF"
        >
          Export Data
        </button>
      </div>

      <LatencyHistoryChart
        showHistorical={showHistorical}
        chartData={chartData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <ConnectionsList
        connections={connectedLinks}
        selectedNodeId={selectedNode.id}
      />
    </div>
  );
};

export default StatsPanel;
