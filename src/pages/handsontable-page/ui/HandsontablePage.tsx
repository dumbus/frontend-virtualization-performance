import React, { useCallback, useEffect, useState } from 'react';

import { HotTable } from '@handsontable/react';

import { useSettings } from 'context';
import { PerformanceWidget } from 'widgets';

import 'handsontable/dist/handsontable.full.min.css';

export const HandsontablePage = () => {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount } = useSettings();

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

  const data = Array.from({ length: totalRowCount }, (_, rowIndex) =>
    Array.from({ length: totalColumnCount }, (_, colIndex) => `R${rowIndex}, C${colIndex}`)
  );

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)' }}>
      <PerformanceWidget updateInterval={100} />

      <HotTable
        data={data}
        width="100%"
        height="100%"
        rowHeaders={false}
        colHeaders={false}
        licenseKey="non-commercial-and-evaluation"
        colWidths={() => colWidth}
        rowHeights={() => rowHeight}
        viewportColumnRenderingOffset={visibleColumnCount}
        viewportRowRenderingOffset={visibleRowCount}
        manualColumnResize={false}
        manualRowResize={false}
        stretchH="none"
      />
    </div>
  );
};
