import React, { useEffect, useState } from 'react';

import { Virtuoso } from 'react-virtuoso';

import { TOTAL_ROWS } from 'shared';
import { VirtualizedPageProps } from 'shared';

export const ReactVirtuosoPage: React.FC<VirtualizedPageProps> = ({
  visibleRowCount = 10,
  visibleColumnCount = 10
}) => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setContainerSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cellWidth = containerSize.width / visibleColumnCount;
  const rowHeight = containerSize.height / visibleRowCount;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Virtuoso
        totalCount={TOTAL_ROWS}
        style={{ height: '100%', width: '100%' }}
        itemSize={() => rowHeight}
        itemContent={(rowIndex) => (
          <div style={{ display: 'flex' }}>
            {Array.from({ length: visibleColumnCount }).map((_, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: cellWidth,
                  height: rowHeight,
                  border: '1px solid #ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxSizing: 'border-box'
                }}
              >
                {`R${rowIndex}, C${colIndex}`}
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};
