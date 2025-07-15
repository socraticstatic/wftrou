import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Wine } from '@/lib/db';
import { events } from '@/lib/events';

export function useWineSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 300);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendationCharacteristics, setRecommendationCharacteristics] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  const pageSize = 20;

  // Subscribe to database changes
  useEffect(() => {
    const handleDbChanged = () => {
      setForceUpdate(prev => prev + 1);
    };

    events.on('db:changed', handleDbChanged);
    return () => {
      events.off('db:changed', handleDbChanged);
    };
  }, []);

  // Use Dexie's live query hook for reactive database queries
  const results = useLiveQuery(
    async () => {
      try {
        if (recommendationCharacteristics.length > 0) {
          return await db.getRecommendations(recommendationCharacteristics, page, pageSize);
        }
        if (!debouncedQuery.trim()) {
          return await db.getAllWines(page, pageSize);
        }
        return await db.searchWines(debouncedQuery, page, pageSize);
      } catch (error) {
        console.error('Search error:', error);
        setError('Failed to fetch wines');
        return { wines: [], total: 0 };
      }
    },
    [debouncedQuery, recommendationCharacteristics, page, forceUpdate],
    { wines: [], total: 0 }
  );

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const getRecommendations = useCallback(async (characteristics: string[]) => {
    if (!characteristics.length) return;

    setIsSearching(true);
    setError(null);
    setPage(1);

    try {
      setRecommendationCharacteristics(characteristics);
      setQuery(characteristics.join(', '));
    } catch (err) {
      console.error('Recommendations error:', err);
      setError('Failed to get recommendations');
      setRecommendationCharacteristics([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setError(null);
    setRecommendationCharacteristics([]);
    setPage(1);
  }, []);

  return {
    query,
    setQuery,
    results: results.wines,
    total: results.total,
    isSearching,
    error,
    page,
    hasMore: results.wines.length < results.total,
    loadMore,
    getRecommendations,
    clearSearch
  };
}