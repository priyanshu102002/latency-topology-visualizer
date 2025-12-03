import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { selectNode } from "../../store/slices/uiSlice";
import NodeHeader from "./NodeHeader";
import ClientLatencyCard from "./ClientLatencyCard";
import KeyMetrics from "./KeyMetrics";
import LatencyHistory from "./LatencyHistory";
import ConnectionList from "./ConnectionList";


interface StatsPanelProps {
  className?: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ className }) => {
  const dispatch = useDispatch();

  const selectedNodeId = useSelector(
    (state: RootState) => state.ui.selectedNodeId
  );
  const nodes = useSelector((state: RootState) => state.topology.nodes);
  const links = useSelector((state: RootState) => state.topology.links);

  const [timeRange, setTimeRange] = useState("1h");

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) || null
    : null;

  if (!selectedNode) {
    return (
      <div className={`...empty-state-ui ${className}`}>
        <h1>No Selected Nodes</h1>
      </div>
    );
  }

  const handleClose = () => dispatch(selectNode(null));

  const connectedLinks = links.filter(
    (l) => l.source === selectedNode.id || l.target === selectedNode.id
  );

  const primaryLink = connectedLinks[0];

  let dataPoints = primaryLink?.history || [];
  if (timeRange === "1h") dataPoints = dataPoints.slice(-20);
  else if (timeRange === "24h") dataPoints = dataPoints.slice(-50);

  const chartData = dataPoints.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    latency: Math.round(h.value),
  }));

  const avgLatency = primaryLink
    ? Math.round(
        primaryLink.history.reduce((acc, curr) => acc + curr.value, 0) /
          primaryLink.history.length
      )
    : 0;

  const currentLinkLatency = primaryLink
    ? Math.round(primaryLink.latencyMs)
    : 0;
  const clientLatency = selectedNode.clientLatency;

  return (
    <div className={`...panel-container ${className}`}>
      <NodeHeader node={selectedNode} onClose={handleClose} />

      {clientLatency !== undefined && (
        <ClientLatencyCard latency={clientLatency} />
      )}

      <KeyMetrics meshLatency={currentLinkLatency} avgLatency={avgLatency} />

      <LatencyHistory
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        chartData={chartData}
      />

      <ConnectionList
        selectedNodeId={selectedNode.id}
        connectedLinks={connectedLinks}
      />
    </div>
  );
};

export default StatsPanel;
