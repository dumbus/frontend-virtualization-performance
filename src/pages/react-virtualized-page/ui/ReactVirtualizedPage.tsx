import React from 'react';

import { AutoSizer, Grid } from 'react-virtualized';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

export const ReactVirtualizedPage = () => {
  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

  const cellRenderer = ({
    columnIndex,
    rowIndex,
    key,
    style
  }: {
    columnIndex: number;
    rowIndex: number;
    key: string;
    style: React.CSSProperties;
  }) => (
    <div
      key={key}
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
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)' }} className="page-container">
      <PerformanceWidget updateInterval={100} />

      <AutoSizer>
        {({ width, height }) => {
          const columnWidth = width / visibleColumnCount;
          const rowHeight = height / visibleRowCount;

          return (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={totalColumnCount}
              rowCount={totalRowCount}
              columnWidth={columnWidth}
              rowHeight={rowHeight}
              width={width}
              height={height}
            />
          );
        }}
      </AutoSizer>
    </div>
  );
};
