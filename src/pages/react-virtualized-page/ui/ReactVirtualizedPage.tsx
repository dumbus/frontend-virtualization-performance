import React from 'react';

import { AutoSizer, Grid } from 'react-virtualized';

import { TOTAL_COLUMNS, TOTAL_ROWS } from 'shared';

import { ReactVirtualizedPageProps } from '../model/types';

export const ReactVirtualizedPage: React.FC<ReactVirtualizedPageProps> = ({
  visibleRowCount = 10,
  visibleColumnCount = 10
}) => {
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
    <div style={{ width: '100vw', height: '100vh' }}>
      <AutoSizer>
        {({ width, height }) => {
          const columnWidth = width / visibleColumnCount;
          const rowHeight = height / visibleRowCount;

          return (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={TOTAL_COLUMNS}
              rowCount={TOTAL_ROWS}
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
