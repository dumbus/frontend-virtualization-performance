import { useCallback, useEffect, useRef, useState } from 'react';

import { VariableSizeGrid as Grid } from 'react-window';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

export const ReactWindowPage = () => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight - 64 });

  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

  const containerRef = useRef<HTMLDivElement>(null);

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight - 64
      });
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  const getColumnWidth = () => containerSize.width / visibleColumnCount;
  const getRowHeight = () => containerSize.height / visibleRowCount;

  const Cell = ({ columnIndex, rowIndex, style }: any) => (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
      }}
    >
      {`R${rowIndex}, C${columnIndex}`}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="page-container"
      style={{
        width: '100vw',
        height: 'calc(100vh - 64px)'
      }}
    >
      <PerformanceWidget updateInterval={100} />

      <Grid
        columnCount={totalColumnCount}
        rowCount={totalRowCount}
        columnWidth={getColumnWidth}
        rowHeight={getRowHeight}
        width={containerSize.width}
        height={containerSize.height}
      >
        {Cell}
      </Grid>
    </div>
  );
};
