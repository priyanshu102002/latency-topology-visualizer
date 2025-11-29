import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateFilter, toggleProvider, setTheme } from '../../store/slices/uiSlice';
import { useGetBtcPriceQuery } from '../../store/api/marketApi';
import { CloudProvider } from '../../types';
import { PROVIDER_COLORS } from '../../constants';
import { Layers, Server, Wifi, Filter, Search, TrendingUp, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ControlPanelProps {
  className?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ className }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.ui.filters);
  const theme = useSelector((state: RootState) => state.ui.theme);
  
  const { data: btcPrice, isLoading: isPriceLoading } = useGetBtcPriceQuery(undefined, { pollingInterval: 10000 });

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`bg-slate-900/90 dark:bg-slate-900/90 bg-white/90 backdrop-blur-lg border-r border-slate-700 dark:border-slate-700 border-slate-200 text-slate-900 dark:text-white p-6 flex flex-col gap-6 overflow-y-auto w-80 h-full ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wifi size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">Latency</h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Visualizer</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      {/* Market Data */}
      <Card className="bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp size={12} /> BTC/USDT
            </span>
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {isPriceLoading ? "Loading..." : btcPrice}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input 
          value={filters.searchQuery}
          onChange={(e) => dispatch(updateFilter({ searchQuery: e.target.value }))}
          placeholder="Search node..." 
          className="pl-10"
        />
      </div>

      {/* Layers Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
          <Layers size={16} /> LAYERS
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Exchanges</span>
            <Switch 
              checked={filters.showExchanges} 
              onCheckedChange={(c) => dispatch(updateFilter({ showExchanges: c }))} 
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Cloud Regions</span>
            <Switch 
              checked={filters.showRegions} 
              onCheckedChange={(c) => dispatch(updateFilter({ showRegions: c }))} 
            />
          </div>
        </div>
      </div>

      {/* Providers Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
          <Server size={16} /> PROVIDERS
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(CloudProvider) as Array<keyof typeof CloudProvider>).map((key) => {
            const provider = CloudProvider[key];
            const isActive = filters.providers[provider];
            return (
              <Button
                key={provider}
                variant="outline"
                onClick={() => dispatch(toggleProvider(provider))}
                className={`justify-between w-full ${isActive ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600' : 'opacity-60'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[provider] }} />
                  {provider}
                </div>
                {isActive && <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-blue-500" />}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Latency Threshold */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
          <Filter size={16} /> LATENCY FILTER
        </h3>
        <div className="px-1">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>0ms</span>
            <span>{filters.maxLatency}ms+</span>
          </div>
          <Slider 
            min={0} 
            max={500} 
            value={[filters.maxLatency]} 
            onValueChange={(vals) => dispatch(updateFilter({ maxLatency: vals[0] }))}
          />
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
         <Card className="bg-emerald-50 dark:bg-slate-800 border-emerald-200 dark:border-slate-700/50">
            <CardContent className="p-3 flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">System Operational</span>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default ControlPanel;