import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: Props) => {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search node..."
        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  );
};

export default SearchInput;
