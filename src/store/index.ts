import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import topologyReducer from './slices/topologySlice';
import uiReducer from './slices/uiSlice';
import { networkApi } from './api/networkApi';

export const store = configureStore({
  reducer: {
    topology: topologyReducer,
    ui: uiReducer,
    [networkApi.reducerPath]: networkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(networkApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;