import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ClientSideRowModelModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const AgGridPage = () => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

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
    return Array.from({ length: totalColumnCount }).map((_, index) => ({
      headerName: `C${index}`,
      field: `col${index}`,
      width: colWidth,
      suppressSizeToFit: true
    }));
  }, [colWidth]);

  const rowData = useMemo(() => {
    return Array.from({ length: totalRowCount }).map((_, rowIndex) => {
      const row: Record<string, string> = {};
      for (let colIndex = 0; colIndex < totalColumnCount; colIndex++) {
        row[`col${colIndex}`] = `R${rowIndex}, C${colIndex}`;
      }
      return row;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="page-container ag-theme-alpine"
      style={{
        width: '100vw',
        height: 'calc(100vh - 64px)'
      }}
    >
      <PerformanceWidget updateInterval={100} />

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
