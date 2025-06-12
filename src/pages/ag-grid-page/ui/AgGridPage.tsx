import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ClientSideRowModelModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-theme-alpine.css';

import { TOTAL_ROWS, TOTAL_COLUMNS } from 'shared';
import { VirtualizedPageProps } from 'shared';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const AgGridPage: React.FC<VirtualizedPageProps> = ({ visibleRowCount = 10, visibleColumnCount = 10 }) => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const containerRef = useRef<HTMLDivElement>(null);

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

  const rowHeight = containerSize.height / visibleRowCount;
  const colWidth = containerSize.width / visibleColumnCount;

  const columnDefs = useMemo<ColDef[]>(() => {
    return Array.from({ length: TOTAL_COLUMNS }).map((_, index) => ({
      headerName: `C${index}`,
      field: `col${index}`,
      width: colWidth,
      suppressSizeToFit: true
    }));
  }, [colWidth]);

  const rowData = useMemo(() => {
    return Array.from({ length: TOTAL_ROWS }).map((_, rowIndex) => {
      const row: Record<string, string> = {};
      for (let colIndex = 0; colIndex < TOTAL_COLUMNS; colIndex++) {
        row[`col${colIndex}`] = `R${rowIndex}, C${colIndex}`;
      }
      return row;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="ag-theme-alpine"
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        headerHeight={0}
        suppressColumnVirtualisation={false}
        suppressRowVirtualisation={false}
        suppressHorizontalScroll={false}
        rowHeight={rowHeight}
        rowBuffer={5}
        domLayout="normal"
        pagination={false}
      />
    </div>
  );
};
