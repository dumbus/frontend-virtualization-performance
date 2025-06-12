import React, { useCallback, useEffect, useRef, useState } from 'react';

import { VariableSizeGrid as Grid } from 'react-window';

import { TOTAL_ROWS, TOTAL_COLUMNS } from 'shared';

import { ReactWindowPageProps } from '../model/types';

export const ReactWindowPage: React.FC<ReactWindowPageProps> = ({ visibleRowCount = 10, visibleColumnCount = 10 }) => {
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
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <Grid
        columnCount={TOTAL_COLUMNS}
        rowCount={TOTAL_ROWS}
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
