import { Search } from 'lucide-react';
import { Input } from './ui/input';

export default function SearchBox({ value, onChange }: any) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search node..."
        className="pl-10"
      />
    </div>
  );
}
