import { Filter } from "lucide-react";

interface Props {
  maxLatency: number;
  onChange: (value: number) => void;
}

const LatencyThreshold = ({ maxLatency, onChange }: Props) => {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
        <Filter size={16} />
        LATENCY FILTER
      </h3>

      <div className="px-1">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
          <span>0ms</span>
          <span>{maxLatency}ms+</span>
        </div>

        <input
          type="range"
          min="0"
          max="500"
          value={maxLatency}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
};

export default LatencyThreshold;
