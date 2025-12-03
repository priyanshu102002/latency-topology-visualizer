import React from "react";
import { Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/types";

interface LatencyHistoryChartProps {
  showHistorical: boolean;
  chartData: ChartDataPoint[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const TIME_RANGE_OPTIONS = [
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
] as const;

export const LatencyHistoryChart: React.FC<LatencyHistoryChartProps> = ({
  showHistorical,
  chartData,
  timeRange,
  onTimeRangeChange,
}) => {
  if (!showHistorical) {
    return (
      <div className="p-6 flex-1 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-slate-500 dark:text-slate-500">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm font-medium mb-2">Historical Data Disabled</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enable "Historical Data" in the control panel to view latency history
            charts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex-1 min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Latency History</h3>

        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded px-2 py-1"
        >
          {TIME_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={10}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                axisLine={false}
                tickLine={false}
                unit="ms"
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  borderColor: "#334155",
                  color: "#fff",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-500 text-sm">
            No active link data
          </div>
        )}
      </div>
    </div>
  );
};

