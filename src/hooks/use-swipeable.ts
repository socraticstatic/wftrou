import { useRef, useEffect } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';

export function useSwipeableResults() {
  const swipeableRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0.5, 1, 0.5]);

  useEffect(() => {
    const element = swipeableRef.current;
    if (!element) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // Only allow scrolling when at the top or bottom
      const isAtTop = element.scrollTop === 0;
      const isAtBottom = 
        element.scrollHeight - element.scrollTop <= element.clientHeight;
      
      if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
        y.set(deltaY / 3); // Add resistance to the swipe
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      isDragging = false;
      animate(y, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30
      });
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [y]);

  return {
    swipeableRef,
    swipeProps: {
      style: {
        y,
        opacity
      }
    }
  };
}