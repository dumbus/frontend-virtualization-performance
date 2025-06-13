/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, ReactNode } from 'react';

import { TOTAL_COLUMNS, TOTAL_ROWS, VISIBLE_COLUMNS, VISIBLE_ROWS } from 'shared';

type Settings = {
  visibleRowCount: number;
  visibleColumnCount: number;
  totalRowCount: number;
  totalColumnCount: number;
  setVisibleRowCount: (value: number) => void;
  setVisibleColumnCount: (value: number) => void;
  setTotalRowCount: (value: number) => void;
  setTotalColumnCount: (value: number) => void;
};

const SettingsContext = createContext<Settings | null>(null);

export const SettingsContextProvider = ({ children }: { children: ReactNode }) => {
  const [visibleRowCount, setVisibleRowCount] = useState(VISIBLE_ROWS);
  const [visibleColumnCount, setVisibleColumnCount] = useState(VISIBLE_COLUMNS);
  const [totalRowCount, setTotalRowCount] = useState(TOTAL_ROWS);
  const [totalColumnCount, setTotalColumnCount] = useState(TOTAL_COLUMNS);

  return (
    <SettingsContext.Provider
      value={{
        visibleRowCount,
        visibleColumnCount,
        totalRowCount,
        totalColumnCount,
        setVisibleRowCount,
        setVisibleColumnCount,
        setTotalRowCount,
        setTotalColumnCount
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');

  return ctx;
};
