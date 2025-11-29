import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeoNode, LatencyLink } from '@/types';
import { NODES } from '@/data/constants';
import { generateInitialLinks, updateLatencies } from '../../services/latencySimulator';

interface TopologyState {
  nodes: GeoNode[];
  links: LatencyLink[];
  lastUpdated: number;
}

const initialState: TopologyState = {
  nodes: NODES,
  links: generateInitialLinks(NODES),
  lastUpdated: Date.now(),
};

export const topologySlice = createSlice({
  name: 'topology',
  initialState,
  reducers: {
    // Advances the simulation one step
    tickSimulation: (state) => {
      state.links = updateLatencies(state.links);
      state.lastUpdated = Date.now();
    },
    // Updates a specific node with real client latency (from RTK Query)
    updateNodeLatency: (state, action: PayloadAction<{ nodeId: string; latency: number }>) => {
      const { nodeId, latency } = action.payload;
      const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex].clientLatency = latency;
        
        // Update status based on latency
        if (latency > 1000) state.nodes[nodeIndex].status = 'maintenance';
        else if (latency > 500) state.nodes[nodeIndex].status = 'degraded';
        else state.nodes[nodeIndex].status = 'operational';
      }
    },
  },
});

export const { tickSimulation, updateNodeLatency } = topologySlice.actions;
export default topologySlice.reducer;