import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TopologyState } from "@/types";
import { NODES } from "@/data/constants";
import {
  generateInitialLinks,
  updateLatencies,
} from "../../services/latencySimulator";

const initialState: TopologyState = {
  nodes: NODES,
  links: generateInitialLinks(NODES),
  lastUpdated: Date.now(),
};

export const topologySlice = createSlice({
  name: "topology",
  initialState,
  reducers: {
    tickSimulation: (state) => {
      state.links = updateLatencies(state.links);
      state.lastUpdated = Date.now();
    },
    updateNodeLatency: (
      state,
      action: PayloadAction<{ nodeId: string; latency: number }>
    ) => {
      const { nodeId, latency } = action.payload;
      const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex].clientLatency = latency;

        if (latency > 1000) state.nodes[nodeIndex].status = "maintenance";
        else if (latency > 500) state.nodes[nodeIndex].status = "degraded";
        else state.nodes[nodeIndex].status = "operational";
      }
    },
  },
});

export const { tickSimulation, updateNodeLatency } = topologySlice.actions;
export default topologySlice.reducer;
