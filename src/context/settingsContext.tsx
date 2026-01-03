/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

const STORAGE_KEY = 'gridSettings';

const getStoredSettings = (): Partial<
  Pick<Settings, 'visibleRowCount' | 'visibleColumnCount' | 'totalRowCount' | 'totalColumnCount'>
> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore parsing errors
  }
  return {};
};

export const SettingsContextProvider = ({ children }: { children: ReactNode }) => {
  const stored = getStoredSettings();

  const [visibleRowCount, setVisibleRowCount] = useState<number>(stored.visibleRowCount ?? VISIBLE_ROWS);
  const [visibleColumnCount, setVisibleColumnCount] = useState<number>(stored.visibleColumnCount ?? VISIBLE_COLUMNS);
  const [totalRowCount, setTotalRowCount] = useState<number>(stored.totalRowCount ?? TOTAL_ROWS);
  const [totalColumnCount, setTotalColumnCount] = useState<number>(stored.totalColumnCount ?? TOTAL_COLUMNS);

  useEffect(() => {
    const toStore = {
      visibleRowCount,
      visibleColumnCount,
      totalRowCount,
      totalColumnCount
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [visibleRowCount, visibleColumnCount, totalRowCount, totalColumnCount]);

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
