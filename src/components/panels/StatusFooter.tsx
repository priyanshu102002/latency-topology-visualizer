import { Card, CardContent } from "../ui/card";

export default function StatusFooter() {
  return (
    <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
      <Card className="bg-emerald-50 dark:bg-slate-800 border-emerald-200 dark:border-slate-700/50">
        <CardContent className="p-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            System Operational
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
