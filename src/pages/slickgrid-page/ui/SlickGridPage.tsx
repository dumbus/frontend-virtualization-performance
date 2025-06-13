import React, { useEffect, useRef, useState } from 'react';

import { SlickGrid, SlickDataView, Column, GridOption } from 'slickgrid';
import Sortable from 'sortablejs';

// It is important to create Sortable global
(window as any).Sortable = Sortable;

import 'slickgrid/dist/styles/css/slick-alpine-theme.css';

import { TOTAL_ROWS, TOTAL_COLUMNS } from 'shared';
import { VirtualizedPageProps } from 'shared';
import { PerformanceWidget } from 'widgets';

export const SlickGridPage: React.FC<VirtualizedPageProps> = ({ visibleRowCount = 10, visibleColumnCount = 10 }) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SlickGrid | null>(null);

  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!gridContainerRef.current) return;

    gridContainerRef.current.innerHTML = '';

    const colWidth = containerSize.width / visibleColumnCount;
    const rowHeight = containerSize.height / visibleRowCount;

    const columns: Column[] = Array.from({ length: TOTAL_COLUMNS }).map((_, i) => ({
      id: `col${i}`,
      name: '',
      field: `col${i}`,
      width: colWidth,
      resizable: false,
      sortable: false
    }));

    const data = Array.from({ length: TOTAL_ROWS }).map((_, rowIndex) => {
      const row: Record<string, string> = { id: `row-${rowIndex}` }; // <-- добавляем id
      for (let colIndex = 0; colIndex < TOTAL_COLUMNS; colIndex++) {
        row[`col${colIndex}`] = `R${rowIndex}, C${colIndex}`;
      }
      return row;
    });

    const options: GridOption = {
      enableCellNavigation: false,
      enableColumnReorder: false,
      rowHeight,
      showHeaderRow: false,
      autoHeight: false,
      explicitInitialization: true,
      headerRowHeight: 0
    };

    const dataView = new SlickDataView({ inlineFilters: true });
    dataView.setItems(data);

    const grid = new SlickGrid(gridContainerRef.current, dataView, columns, options);
    gridRef.current = grid;

    grid.init();

    return () => {
      grid.destroy();
    };
  }, [containerSize, visibleRowCount, visibleColumnCount]);

  return (
    <>
      <PerformanceWidget updateInterval={100} />

      <div
        ref={gridContainerRef}
        className="slick-container alpine-theme"
        style={{
          width: '100vw',
          height: 'calc(100vh - 64px)'
        }}
      />
      <style>
        {`
          .slick-header {
            display: none !important;
          }
        `}
      </style>
    </>
  );
};
