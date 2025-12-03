import { Activity, History } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function VisualizationToggles({
  showRealTime,
  showHistorical,
  onToggle
}: any) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        <Activity size={16} /> VISUALIZATION
      </h3>

      <div className="space-y-3">
        <SettingRow
          icon={<Activity size={14} className="text-slate-400" />}
          label="Real-time Connections"
          checked={showRealTime}
          onChange={(v: boolean) => onToggle({ showRealTime: v })}
        />

        <SettingRow
          icon={<History size={14} className="text-slate-400" />}
          label="Historical Data"
          checked={showHistorical}
          onChange={(v: boolean) => onToggle({ showHistorical: v })}
        />
      </div>
    </div>
  );
}

function SettingRow({ icon, label, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
