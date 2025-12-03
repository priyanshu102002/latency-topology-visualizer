import { Layers } from "lucide-react";

interface Props {
  showExchanges: boolean;
  showRegions: boolean;
  onToggle: (partial: {
    showExchanges?: boolean;
    showRegions?: boolean;
  }) => void;
}

const LayersSection = ({ showExchanges, showRegions, onToggle }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 ">
        <Layers size={16} />
        LAYERS
      </h3>

      <SectionToggle
        label="Show Exchanges"
        checked={showExchanges}
        onChange={(v) => onToggle({ showExchanges: v })}
      />

      <SectionToggle
        label="Show Cloud Regions"
        checked={showRegions}
        onChange={(v) => onToggle({ showRegions: v })}
      />
    </div>
  );
};

export default LayersSection;

const SectionToggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
    <span className="text-sm">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-blue-500 h-4 w-4"
    />
  </label>
);
