import { useEffect, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

interface UseVirtualScrollOptions<T> {
  items: T[];
  estimateSize?: number;
  overscan?: number;
  loadMore?: () => Promise<void>;
  hasMore?: boolean;
  loadTriggerOffset?: number;
}

export function useVirtualScroll<T>({
  items,
  estimateSize = 200,
  overscan = 5,
  loadMore,
  hasMore = false,
  loadTriggerOffset = 500
}: UseVirtualScrollOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    overscan,
    scrollMargin: parentRef.current?.offsetTop ?? 0
  });

  useEffect(() => {
    if (!loadMore || !hasMore || isLoading) return;

    const scrollElement = document.scrollingElement || document.documentElement;
    const handleScroll = async () => {
      const { scrollHeight, scrollTop, clientHeight } = scrollElement;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceToBottom < loadTriggerOffset) {
        setIsLoading(true);
        await loadMore();
        setIsLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore, isLoading, loadTriggerOffset]);

  return {
    virtualizer,
    parentRef,
    isLoading
  };
}