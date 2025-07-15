import { useRef, useEffect, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight = 200,
  overscan = 3,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setParentHeight(entries[0].contentRect.height);
      });
      resizeObserver.observe(parentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => itemHeight,
    overscan,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-16rem)] sm:h-[60vh] overflow-auto scroll-area"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}