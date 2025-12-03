import React from "react";
import { GeoNode } from "@/types";
import { MapPin } from "lucide-react";

interface NodeHeaderProps {
  node: GeoNode;
  onClose: () => void;
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({ node, onClose }) => {
  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-800 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xl"
        aria-label="Close panel"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold">{node.name}</h2>

      <div className="flex items-center gap-2 mt-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            node.status === "operational"
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          {node.status}
        </span>
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {node.provider}
        </span>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-500 font-mono mt-2 flex items-center gap-1">
        <MapPin size={12} />
        {node.regionCode} • {node.lat.toFixed(2)}, {node.lng.toFixed(2)}
      </div>
    </div>
  );
};

