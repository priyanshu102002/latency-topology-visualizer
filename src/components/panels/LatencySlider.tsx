import { Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function LatencySlider({ maxLatency, onChange }: any) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        <Filter size={16} /> LATENCY FILTER
      </h3>

      <div className="px-1">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>0ms</span>
          <span>{maxLatency}ms+</span>
        </div>

        <Slider
          min={0}
          max={500}
          value={[maxLatency]}
          onValueChange={(vals) => onChange(vals[0])}
        />
      </div>
    </div>
  );
}
