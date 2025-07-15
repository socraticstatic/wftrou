import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  searchFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export function SearchBar({
  query,
  onQueryChange,
  onClear,
  searchFocused,
  onFocus,
  onBlur
}: SearchBarProps) {
  return (
    <div className="relative mb-8">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400 dark:text-rose-400 pointer-events-none" />
        <Input
          className="w-full h-12 sm:h-14 pl-12 pr-[4.5rem] rounded-2xl border border-rose-100 
                   focus:border-rose-300 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm 
                   text-base sm:text-lg text-gray-900 dark:text-rose-300 dark:border-rose-800
                   dark:focus:border-rose-700 dark:placeholder:text-rose-500/50
                   mobile-tap-target shadow-sm"
          placeholder="Try 'smooth red wine with dark fruits' or 'crisp white for seafood'..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {query && (
          <Button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-600 hover:bg-rose-700 
                     dark:bg-rose-800 dark:hover:bg-rose-700 text-white h-8 w-8 p-0 rounded-xl 
                     flex items-center justify-center"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}