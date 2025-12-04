const TIME_RANGES = {
  ONE_HOUR: "1h",
  TWENTY_FOUR_HOURS: "24h",
  SEVEN_DAYS: "7d"
} as const;

export const formatTime = (timestamp: number, timeRange: string): string => {
  const date = new Date(timestamp);

  if (timeRange === TIME_RANGES.SEVEN_DAYS) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
