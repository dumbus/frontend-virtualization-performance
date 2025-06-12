import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { TOTAL_ROWS, TOTAL_COLUMNS } from 'shared';

import { TanstackVirtualPageProps } from '../model/types';

export const TanstackVirtualPage: React.FC<TanstackVirtualPageProps> = ({
  visibleRowCount = 10,
  visibleColumnCount = 10
}) => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  const parentRef = containerRef;

  const rowVirtualizer = useVirtualizer({
    count: TOTAL_ROWS,
    getScrollElement: () => parentRef.current,
    estimateSize: () => containerSize.height / visibleRowCount,
    overscan: 5,
    horizontal: false
  });

  const columnVirtualizer = useVirtualizer({
    count: TOTAL_COLUMNS,
    getScrollElement: () => parentRef.current,
    estimateSize: () => containerSize.width / visibleColumnCount,
    overscan: 5,
    horizontal: true
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <div
        style={{
          width: columnVirtualizer.getTotalSize(),
          height: rowVirtualizer.getTotalSize(),
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((row) =>
          columnVirtualizer.getVirtualItems().map((column) => (
            <div
              key={`${row.index}-${column.index}`}
              style={{
                position: 'absolute',
                top: row.start,
                left: column.start,
                width: column.size,
                height: row.size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            >
              {`R${row.index}, C${column.index}`}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
