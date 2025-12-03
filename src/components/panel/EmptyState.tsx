import React from "react";
import { MapPin } from "lucide-react";

interface EmptyStateProps {
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ className }) => {
  return (
    <div
      className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-l border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-6 w-80 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
        <MapPin size={32} className="text-slate-400 dark:text-slate-500" />
      </div>
      <h2 className="text-lg font-semibold mb-2">Select a Node</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Click any exchange or region marker on the globe to view real-time
        latency statistics.
      </p>
    </div>
  );
};

