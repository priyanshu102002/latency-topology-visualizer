import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function LatencyHistory({
  timeRange,
  setTimeRange,
  chartData,
}: any) {
  return (
    <div className="p-6 flex-1">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-sm">Latency History</h3>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-100  border border-slate-300 text-xs rounded px-2 py-1 outline-none"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">24 Hours</option>
          <option value="7d">7 Days</option>
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} unit="ms" />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a" }} />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
