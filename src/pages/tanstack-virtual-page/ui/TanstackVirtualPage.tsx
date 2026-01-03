import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

export const TanstackVirtualPage = () => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

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
    count: totalRowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => containerSize.height / visibleRowCount,
    overscan: 5,
    horizontal: false
  });

  const columnVirtualizer = useVirtualizer({
    count: totalColumnCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => containerSize.width / visibleColumnCount,
    overscan: 5,
    horizontal: true
  });

  return (
    <div
      ref={containerRef}
      className="page-container"
      style={{
        width: '100vw',
        height: 'calc(100vh - 64px)',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <PerformanceWidget updateInterval={100} />

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
