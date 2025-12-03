import { Laptop } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientLatencyCard({ latency }: { latency: number }) {
  return (
    <div className="px-6 pt-6 pb-2">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Laptop size={12} /> Client → Node
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${
                latency > 200 ? "text-yellow-500" : ""
              }`}
            >
              {latency}
            </span>
            <span className="text-sm text-slate-500">ms</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
