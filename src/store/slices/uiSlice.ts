import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CloudProvider, FilterState } from "@/types";

interface UiState {
  isSidebarOpen: boolean;
  selectedNodeId: string | null;
  filters: FilterState;
}

const initialState: UiState = {
  isSidebarOpen: true,
  selectedNodeId: null,
  filters: {
    showExchanges: true,
    showRegions: true,
    showRealTime: true,
    showHistorical: true,
    providers: {
      [CloudProvider.AWS]: true,
      [CloudProvider.GCP]: true,
      [CloudProvider.AZURE]: true,
      [CloudProvider.PRIVATE]: true,
    },
    maxLatency: 500,
    searchQuery: "",
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    updateFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleProvider: (state, action: PayloadAction<CloudProvider>) => {
      state.filters.providers[action.payload] =
        !state.filters.providers[action.payload];
    },
  },
});

export const { toggleSidebar, selectNode, updateFilter, toggleProvider } =
  uiSlice.actions;
export default uiSlice.reducer;
