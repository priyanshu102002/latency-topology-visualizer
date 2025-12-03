import { CloudProvider } from "@/types";
import { PROVIDER_COLORS } from "@/data/constants";
import { Server } from "lucide-react";

interface Props {
  activeProviders: Record<CloudProvider, boolean>;
  onToggleProvider: (p: CloudProvider) => void;
}

const ProviderSection = ({ activeProviders, onToggleProvider }: Props) => {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
        <Server size={16} />
        PROVIDERS
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(CloudProvider) as Array<CloudProvider>).map((provider) => {
          const isActive = activeProviders[provider];

          return (
            <button
              key={provider}
              onClick={() => onToggleProvider(provider)}
              className={`flex items-center justify-between p-2 px-3 rounded-lg text-sm border transition-all ${
                isActive
                  ? "bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white"
                  : "bg-transparent border-transparent text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PROVIDER_COLORS[provider] }}
                />
                {provider}
              </div>

              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  isActive ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                    isActive ? "translate-x-4" : ""
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderSection;
