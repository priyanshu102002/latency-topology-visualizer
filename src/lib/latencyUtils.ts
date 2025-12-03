// Constants
export const LATENCY_THRESHOLDS = {
  CRITICAL: 150,
  WARNING: 100,
  CLIENT_WARNING: 200,
} as const;

// Utility functions
export const getLatencyColor = (latency: number): string => {
  if (latency > LATENCY_THRESHOLDS.CRITICAL) {
    return "text-red-600 dark:text-red-400";
  }
  if (latency > LATENCY_THRESHOLDS.WARNING) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  return "text-emerald-600 dark:text-emerald-400";
};

export const getClientLatencyColor = (latency: number): string => {
  return latency > LATENCY_THRESHOLDS.CLIENT_WARNING
    ? "text-yellow-600 dark:text-yellow-400"
    : "text-slate-900 dark:text-white";
};

