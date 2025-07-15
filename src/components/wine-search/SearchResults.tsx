import { motion } from 'framer-motion';
import { WineGlass } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WineListItem } from '@/components/wine-list';
import type { Wine } from '@/lib/db';

interface SearchResultsProps {
  isSearching: boolean;
  error: string | null;
  results: Wine[];
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function SearchResults({
  isSearching,
  error,
  results,
  total,
  hasMore,
  isLoadingMore,
  onLoadMore
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <Card className="p-6 text-center text-gray-500 dark:text-rose-300 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
        <span className="text-sm sm:text-base">Searching...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-rose-500 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
        <span className="text-sm sm:text-base">{error}</span>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 dark:text-rose-300 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
        <span className="text-sm sm:text-base">
          No wines found. Try different keywords!
        </span>
      </Card>
    );
  }

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
    >
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-rose-100 dark:border-rose-800 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm rounded-xl p-4 flex items-center justify-center gap-3"
      >
        <WineGlass className="w-5 h-5 text-rose-500 dark:text-rose-400" />
        <span className="text-gray-600 dark:text-rose-300">
          <span className="font-semibold text-rose-600 dark:text-rose-400">{total}</span>
          {' '}delightful wine{total !== 1 ? 's' : ''} discovered
        </span>
      </motion.div>

      {results.map((wine) => (
        <WineListItem key={wine.id} wine={wine} />
      ))}

      {hasMore && (
        <motion.div 
          className="pt-4 text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-800 dark:hover:bg-rose-700 text-white px-6 h-12"
          >
            {isLoadingMore ? 'Loading...' : 'Discover More Wines'}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}