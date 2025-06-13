import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

export const CustomObserverApiPage = () => {
  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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

  const [visibleCells, setVisibleCells] = useState<Set<string>>(new Set());

  const observer = useRef<IntersectionObserver | null>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        setVisibleCells((prevVisibleCells) => {
          const newVisibleCells = new Set(prevVisibleCells);

          entries.forEach((entry) => {
            const key = entry.target.getAttribute('data-key');
            if (!key) return;

            if (entry.isIntersecting) {
              newVisibleCells.add(key);
            } else {
              newVisibleCells.delete(key);
            }
          });
          return newVisibleCells;
        });
      },
      {
        root: containerRef.current,
        rootMargin: '200px', // buffer
        threshold: 0.01
      }
    );

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!observer.current) return;
    observer.current.disconnect();

    cellRefs.current.forEach((el) => {
      if (el) observer.current!.observe(el);
    });
  }, [visibleCells]);

  const visibleRows: number[] = [];
  const visibleCols: number[] = [];

  visibleCells.forEach((key) => {
    const [r, c] = key.split('-').map(Number);
    visibleRows.push(r);
    visibleCols.push(c);
  });

  const minRow = visibleRows.length ? Math.max(0, Math.min(...visibleRows) - 5) : 0;
  const maxRow = visibleRows.length ? Math.min(totalRowCount - 1, Math.max(...visibleRows) + 5) : visibleRowCount;
  const minCol = visibleCols.length ? Math.max(0, Math.min(...visibleCols) - 5) : 0;
  const maxCol = visibleCols.length ? Math.min(totalColumnCount - 1, Math.max(...visibleCols) + 5) : visibleColumnCount;

  const cellsToRender = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const key = `${r}-${c}`;
      cellsToRender.push(key);
    }
  }

  return (
    <div
      ref={containerRef}
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
          width: cellWidth * totalColumnCount,
          height: cellHeight * totalRowCount,
          position: 'relative'
        }}
      >
        {cellsToRender.map((key) => {
          const [rowIndex, colIndex] = key.split('-').map(Number);

          return (
            <div
              key={key}
              data-key={key}
              ref={(el) => {
                cellRefs.current.set(key, el);
                return;
              }}
              style={{
                position: 'absolute',
                top: rowIndex * cellHeight,
                left: colIndex * cellWidth,
                width: cellWidth,
                height: cellHeight,
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: visibleCells.has(key) ? '#d0f0d0' : '#fff'
              }}
            >
              {`R${rowIndex}, C${colIndex}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};
