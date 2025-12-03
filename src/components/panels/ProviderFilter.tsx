import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { PROVIDER_COLORS } from "@/data/constants";
import { CloudProvider } from "../../types";

export default function ProviderFilter({
  providers,
  toggleProvider,
}: {
  providers: Record<CloudProvider, boolean>;
  toggleProvider: (p: CloudProvider) => void;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
        PROVIDERS
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(CloudProvider) as Array<CloudProvider>).map(
          (provider) => {
            const isActive = providers[provider];
            return (
              <Button
                key={provider}
                variant="outline"
                onClick={() => toggleProvider(provider)}
                className={`justify-between w-full ${
                  isActive
                    ? "bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: PROVIDER_COLORS[provider] }}
                  />
                  {provider}
                </div>

                {isActive && (
                  <Badge
                    variant="secondary"
                    className="h-2 w-2 p-0 rounded-full bg-blue-500"
                  />
                )}
              </Button>
            );
          }
        )}
      </div>
    </div>
  );
}
