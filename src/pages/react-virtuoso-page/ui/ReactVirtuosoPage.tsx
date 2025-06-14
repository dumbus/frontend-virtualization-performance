import React, { useEffect, useState } from 'react';

import { Virtuoso } from 'react-virtuoso';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

export const ReactVirtuosoPage = () => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { visibleRowCount, visibleColumnCount, totalRowCount } = useSettings();

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
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)' }} className="page-container">
      <PerformanceWidget updateInterval={100} />

      <Virtuoso
        totalCount={totalRowCount}
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
