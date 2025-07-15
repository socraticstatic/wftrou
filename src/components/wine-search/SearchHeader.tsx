import { WineGlass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BOOK_URL = "https://www.amazon.com/dp/B0DNFLTXGN";

interface SearchHeaderProps {
  onQuizStart: () => void;
}

export function SearchHeader({ onQuizStart }: SearchHeaderProps) {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center">
        <WineGlass className="w-12 h-12 text-rose-600 dark:text-rose-400" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-rose-200">
        Wine for the Rest of Us
      </h1>
      <div className="space-y-2">
        <p className="text-gray-600 dark:text-rose-300 max-w-2xl mx-auto text-sm sm:text-base">
          The official companion app to the bestselling book that's making wine accessible for everyone.
          Discover your perfect wine by describing what you already know you like.
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-rose-400">
          Use keywords like "fruity", "full-bodied", or even food pairings like "pasta" to find your ideal match.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <Button
          onClick={onQuizStart}
          className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-800/80 dark:hover:bg-rose-700/80 text-white h-12 mobile-tap-target"
        >
          Take the Wine Quiz
        </Button>
        <Button
          variant="outline"
          className="border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/30 dark:text-rose-300 h-12 mobile-tap-target"
          onClick={() => window.open(BOOK_URL, '_blank', 'noopener,noreferrer')}
        >
          Get the Book
        </Button>
      </div>
    </div>
  );
}