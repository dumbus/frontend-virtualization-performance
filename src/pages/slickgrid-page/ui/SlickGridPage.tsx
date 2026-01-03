import React, { useEffect, useRef, useState } from 'react';

import { SlickGrid, SlickDataView, Column, GridOption } from 'slickgrid';
import Sortable from 'sortablejs';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

import 'slickgrid/dist/styles/css/slick-alpine-theme.css';

// It is important to create Sortable global
(window as any).Sortable = Sortable;

export const SlickGridPage = () => {
  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

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

    const columns: Column[] = Array.from({ length: totalColumnCount }).map((_, i) => ({
      id: `col${i}`,
      name: '',
      field: `col${i}`,
      width: colWidth,
      resizable: false,
      sortable: false
    }));

    const data = Array.from({ length: totalRowCount }).map((_, rowIndex) => {
      const row: Record<string, string> = { id: `row-${rowIndex}` };

      for (let colIndex = 0; colIndex < totalColumnCount; colIndex++) {
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
  }, [containerSize, visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount]);

  return (
    <div
      className="page-container"
      style={{
        width: '100vw',
        height: 'calc(100vh - 64px)'
      }}
    >
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
    </div>
  );
};
