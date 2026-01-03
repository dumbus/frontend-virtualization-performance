import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

export const CustomCssContentVisibilityPage = () => {
  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const buffer = 5;

  const updateContainerSize = useCallback(() => {
    setContainerSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  const cellWidth = containerSize.width / visibleColumnCount;
  const cellHeight = containerSize.height / visibleRowCount;

  const totalWidth = totalColumnCount * cellWidth;
  const totalHeight = totalRowCount * cellHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const startRow = Math.max(0, Math.floor(scrollTop / cellHeight) - buffer);
  const endRow = Math.min(totalRowCount, Math.ceil((scrollTop + containerSize.height) / cellHeight) + buffer);

  const startCol = Math.max(0, Math.floor(scrollLeft / cellWidth) - buffer);
  const endCol = Math.min(totalColumnCount, Math.ceil((scrollLeft + containerSize.width) / cellWidth) + buffer);

  const visibleRows = [];
  for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
    const cells = [];
    for (let colIndex = startCol; colIndex < endCol; colIndex++) {
      cells.push(
        <div
          key={`r${rowIndex}c${colIndex}`}
          style={{
            position: 'absolute',
            top: rowIndex * cellHeight,
            left: colIndex * cellWidth,
            width: cellWidth,
            height: cellHeight,
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            contentVisibility: 'auto',
            containIntrinsicSize: `${cellHeight}px ${cellWidth}px`
          }}
        >
          {`R${rowIndex}, C${colIndex}`}
        </div>
      );
    }
    visibleRows.push(...cells);
  }

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
      onScroll={handleScroll}
    >
      <PerformanceWidget updateInterval={100} />

      <div
        style={{
          width: totalWidth,
          height: totalHeight,
          position: 'relative'
        }}
      >
        {visibleRows}
      </div>
    </div>
  );
};
