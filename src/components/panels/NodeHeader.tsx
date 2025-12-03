import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function NodeHeader({ node, onClose }: any) {
  return (
    <div className="p-6 border-b relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4"
      >
        &times;
      </Button>

      <h2 className="text-2xl font-bold">{node.name}</h2>

      <div className="flex items-center gap-2 mt-1">
        <Badge
          variant={node.status === "operational" ? "default" : "destructive"}
        >
          {node.status}
        </Badge>
        <span className="text-xs uppercase font-bold">{node.provider}</span>
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-1 mt-2">
        <MapPin size={12} />
        {node.regionCode} • {node.lat.toFixed(2)}, {node.lng.toFixed(2)}
      </div>
    </div>
  );
}
