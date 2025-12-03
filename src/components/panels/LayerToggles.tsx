import { Layers } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function LayerToggles({
  showExchanges,
  showRegions,
  onToggle
}: any) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        <Layers size={16} /> LAYERS
      </h3>

      <div className="space-y-3">
        <Row
          label="Show Exchanges"
          checked={showExchanges}
          onChange={(v: boolean) => onToggle({ showExchanges: v })}
        />

        <Row
          label="Show Cloud Regions"
          checked={showRegions}
          onChange={(v: boolean) => onToggle({ showRegions: v })}
        />
      </div>
    </div>
  );
}

function Row({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
