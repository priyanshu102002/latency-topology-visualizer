import React from "react";
import { Activity, History } from "lucide-react";

interface Props {
  showRealTime: boolean;
  showHistorical: boolean;
  onToggle: (partial: {
    showRealTime?: boolean;
    showHistorical?: boolean;
  }) => void;
}

const VisualizationSection = ({
  showRealTime,
  showHistorical,
  onToggle,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
        <Activity size={16} />
        VISUALIZATION
      </h3>

      <ToggleRow
        icon={<Activity size={14} className="text-slate-400" />}
        label="Real-time Connections"
        checked={showRealTime}
        onChange={(v) => onToggle({ showRealTime: v })}
      />

      <ToggleRow
        icon={<History size={14} className="text-slate-400" />}
        label="Historical Data"
        checked={showHistorical}
        onChange={(v) => onToggle({ showHistorical: v })}
      />
    </div>
  );
};

export default VisualizationSection;

const ToggleRow = ({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  icon: React.ReactNode;
  onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-blue-500 h-4 w-4"
    />
  </label>
);
