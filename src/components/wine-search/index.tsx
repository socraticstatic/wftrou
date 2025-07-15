import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WineQuiz } from '@/components/wine-quiz';
import { WineListItem } from '@/components/wine-list';
import { useWineSearch } from '@/hooks/use-wine-search';
import { SearchHeader } from './SearchHeader';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

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
    error,
    getRecommendations,
    clearSearch,
    loadMore,
    hasMore
  } = useWineSearch();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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
      }
    }
  };

  const showEditorsChoice = !query && !searchFocused && !showQuiz;

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

      <SearchHeader onQuizStart={() => setShowQuiz(true)} />

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onClear={clearSearch}
        searchFocused={searchFocused}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />

      <AnimatePresence mode="wait">
        {showEditorsChoice ? (
          <WineListItem wine={EDITORS_CHOICE} isEditorsChoice={true} />
        ) : query && (
          <SearchResults
            isSearching={isSearching}
            error={error}
            results={results}
            total={total}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
        )}
      </AnimatePresence>
    </div>
  );
}