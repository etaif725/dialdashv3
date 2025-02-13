import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';
import type { Lead } from '../../../types/api';

interface VirtualizedTableProps {
  data: Lead[];
  rowHeight: number;
  overscan?: number;
}

export function VirtualizedTable({ data, rowHeight, overscan = 5 }: VirtualizedTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {/* Your row content here */}
            <LeadTableRow lead={data[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
} 