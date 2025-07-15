import { useState, useEffect } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  pullDistance?: number;
  resistance?: number;
}

export function usePullToRefresh({ onRefresh, pullDistance = 100, resistance = 3 }: PullToRefreshOptions) {
  const [pulling, setPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        setPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (pulling) {
        currentY = e.touches[0].clientY;
        const delta = (currentY - startY) / resistance;
        if (delta > 0) {
          setPullY(delta);
          if (delta >= pullDistance && !refreshing) {
            navigator.vibrate?.(10); // Haptic feedback
          }
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pulling) {
        if (pullY >= pullDistance) {
          setRefreshing(true);
          try {
            await onRefresh();
            navigator.vibrate?.(20); // Success feedback
          } catch {
            navigator.vibrate?.([20, 50, 20]); // Error feedback
          }
          setRefreshing(false);
        }
        setPullY(0);
        setPulling(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, pullY, refreshing, onRefresh, pullDistance, resistance]);

  return { pullY, refreshing };
}