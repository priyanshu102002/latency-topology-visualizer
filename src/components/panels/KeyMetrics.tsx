import { Card, CardContent } from "@/components/ui/card";
import { Globe, Clock } from "lucide-react";

export default function KeyMetrics({ meshLatency, avgLatency }: any) {
  return (
    <div className="grid grid-cols-2 gap-4 p-6 border-b">
      {/* Mesh */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-xs mb-1">
            <Globe size={12} /> Mesh Latency
          </div>
          <div
            className={`text-2xl font-bold ${
              meshLatency > 250
                ? "text-red-500"
                : meshLatency > 120
                ? "text-yellow-500"
                : "text-emerald-500"
            }`}
          >
            {meshLatency}ms
          </div>
        </CardContent>
      </Card>

      {/* Average */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-xs mb-1">
            <Clock size={12} /> Avg (1h)
          </div>
          <div className="text-2xl font-bold text-blue-500">{avgLatency}ms</div>
        </CardContent>
      </Card>
    </div>
  );
}
