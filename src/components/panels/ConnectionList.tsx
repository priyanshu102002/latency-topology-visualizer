export default function ConnectionList({
  selectedNodeId,
  connectedLinks,
}: any) {
  return (
    <div className="px-6 mt-6">
      <h3 className="font-semibold text-sm mb-3">Active Connections</h3>

      <div className="space-y-2">
        {connectedLinks.map((link: any) => {
          const latency = Math.round(link.latencyMs);
          const isHigh = latency > 250;
          const isWarn = latency > 120;

          return (
            <div
              key={link.id}
              className="flex justify-between p-3 bg-slate-100 dark:bg-slate-800/30 rounded"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">
                  {link.source === selectedNodeId ? link.target : link.source}
                </span>
                <span className="text-xs text-slate-500">Direct Route</span>
              </div>

              <div
                className={`text-sm font-bold ${
                  isHigh
                    ? "text-red-500"
                    : isWarn
                    ? "text-yellow-500"
                    : "text-emerald-500"
                }`}
              >
                {latency}ms
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
