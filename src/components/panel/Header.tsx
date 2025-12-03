import { Wifi } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Wifi size={24} className="text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold leading-none tracking-tight">
            Latency
          </h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Visualizer
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
