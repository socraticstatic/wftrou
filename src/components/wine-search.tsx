import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine as WineGlass, Search, BookOpen, X, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WineQuiz } from '@/components/wine-quiz';
import { WineListItem } from '@/components/wine-list';
import { useWineSearch } from '@/hooks/use-wine-search';
import { db } from '@/lib/db';

const BOOK_URL = "https://www.amazon.com/dp/B0DNFLTXGN";

const EDITORS_CHOICE = {
  id: '1',
  name: 'Château Latour 2015',
  type: 'red',
  region: 'Pauillac, Bordeaux',
  country: 'France',
  characteristics: ['full-bodied', 'black fruits', 'complex', 'tannic', 'cedar'],
  pairings: ['red meat', 'aged cheese', 'game'],
  description: 'First Growth Bordeaux with exceptional power and finesse, showing cassis and cedar notes',
  icon: 'redWine'
};

export function WineSearch() {
  const {
    query,
    setQuery,
    results,
    total,
    isSearching,
    error: searchError,
    getRecommendations,
    clearSearch,
    loadMore,
    hasMore
  } = useWineSearch();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await db.initializeIfEmpty();
        if (!success) {
          throw new Error('Failed to initialize database');
        }
        setIsInitialized(true);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError('Failed to initialize wine database. Please refresh the page.');
        setIsInitialized(false);
      }
    };

    initialize();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleQuizComplete = async (characteristics: string[]) => {
    setShowQuiz(false);
    if (characteristics.length > 0) {
      try {
        await getRecommendations(characteristics);
      } catch (err) {
        console.error('Recommendations error:', err);
        setError('Failed to get wine recommendations. Please try again.');
      }
    }
  };

  const showEditorsChoice = !query && !searchFocused && !showQuiz;

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center text-gray-500 dark:text-rose-300 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
          <span className="text-sm sm:text-base">
            {error || 'Initializing wine database...'}
          </span>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {showQuiz && (
          <WineQuiz
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-8"
      >
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
            onClick={() => setShowQuiz(true)}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-800/80 dark:hover:bg-rose-700/80 text-white h-12 mobile-tap-target"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Take the Wine Quiz
          </Button>
          <Button
            variant="outline"
            className="border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/30 dark:text-rose-300 h-12 mobile-tap-target"
            onClick={() => window.open(BOOK_URL, '_blank', 'noopener,noreferrer')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Get the Book
          </Button>
        </div>
      </motion.div>

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
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {query && (
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-600 hover:bg-rose-700 
                       dark:bg-rose-800 dark:hover:bg-rose-700 text-white h-8 w-8 p-0 rounded-xl 
                       flex items-center justify-center"
              onClick={clearSearch}
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showEditorsChoice ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <WineListItem wine={EDITORS_CHOICE} isEditorsChoice={true} />
          </motion.div>
        ) : query && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {isSearching ? (
              <Card className="p-6 text-center text-gray-500 dark:text-rose-300 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
                <span className="text-sm sm:text-base">Searching...</span>
              </Card>
            ) : error || searchError ? (
              <Card className="p-6 text-center text-rose-500 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
                <span className="text-sm sm:text-base">{error || searchError}</span>
              </Card>
            ) : results.length > 0 ? (
              <>
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
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-800 dark:hover:bg-rose-700 text-white px-6 h-12"
                    >
                      {isLoadingMore ? 'Loading...' : 'Discover More Wines'}
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <Card className="p-6 text-center text-gray-500 dark:text-rose-300 border border-rose-100 dark:border-rose-800 dark:bg-gray-800/50">
                <span className="text-sm sm:text-base">
                  No wines found. Try different keywords!
                </span>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}