export default function Legend () {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white/90 dark:bg-slate-900/80 backdrop-blur px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 pointer-events-none hidden md:flex gap-6 text-xs text-slate-600 dark:text-slate-300 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-3 h-1 bg-[#00FF00] rounded-full shadow-[0_0_5px_#00FF00]"></div>
        <span>&lt; 120ms (Low)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-1 bg-[#FFD700] rounded-full shadow-[0_0_5px_#FFD700]"></div>
        <span>120-250ms (Med)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-1 bg-[#FF0000] rounded-full shadow-[0_0_5px_#FF0000]"></div>
        <span>&gt; 250ms (High)</span>
      </div>
    </div>
  );
};
