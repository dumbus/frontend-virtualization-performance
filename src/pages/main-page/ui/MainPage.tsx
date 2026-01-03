import React, { useState, useEffect } from 'react';

import { useSettings } from 'context/settingsContext';

import { VISIBLE_ROWS, VISIBLE_COLUMNS, TOTAL_ROWS, TOTAL_COLUMNS } from 'shared'; // импорт дефолтных значений

export const MainPage = () => {
  const {
    visibleRowCount,
    visibleColumnCount,
    totalRowCount,
    totalColumnCount,
    setVisibleRowCount,
    setVisibleColumnCount,
    setTotalRowCount,
    setTotalColumnCount
  } = useSettings();

  const [visibleRowsInput, setVisibleRowsInput] = useState(String(visibleRowCount));
  const [visibleColsInput, setVisibleColsInput] = useState(String(visibleColumnCount));
  const [totalRowsInput, setTotalRowsInput] = useState(String(totalRowCount));
  const [totalColsInput, setTotalColsInput] = useState(String(totalColumnCount));

  useEffect(() => setVisibleRowsInput(String(visibleRowCount)), [visibleRowCount]);
  useEffect(() => setVisibleColsInput(String(visibleColumnCount)), [visibleColumnCount]);
  useEffect(() => setTotalRowsInput(String(totalRowCount)), [totalRowCount]);
  useEffect(() => setTotalColsInput(String(totalColumnCount)), [totalColumnCount]);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const applySettings = () => {
    const parsedVisibleRows = parseInt(visibleRowsInput, 10);
    const parsedVisibleCols = parseInt(visibleColsInput, 10);
    const parsedTotalRows = parseInt(totalRowsInput, 10);
    const parsedTotalCols = parseInt(totalColsInput, 10);

    if (!isNaN(parsedVisibleRows) && parsedVisibleRows > 0) {
      setVisibleRowCount(parsedVisibleRows);
    }

    if (!isNaN(parsedVisibleCols) && parsedVisibleCols > 0) {
      setVisibleColumnCount(parsedVisibleCols);
    }

    if (!isNaN(parsedTotalRows) && parsedTotalRows > 0) {
      setTotalRowCount(parsedTotalRows);
    }

    if (!isNaN(parsedTotalCols) && parsedTotalCols > 0) {
      setTotalColumnCount(parsedTotalCols);
    }
  };

  const resetSettings = () => {
    setVisibleRowCount(VISIBLE_ROWS);
    setVisibleColumnCount(VISIBLE_COLUMNS);
    setTotalRowCount(TOTAL_ROWS);
    setTotalColumnCount(TOTAL_COLUMNS);

    setVisibleRowsInput(String(VISIBLE_ROWS));
    setVisibleColsInput(String(VISIBLE_COLUMNS));
    setTotalRowsInput(String(TOTAL_ROWS));
    setTotalColsInput(String(TOTAL_COLUMNS));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Настройки стенда</h1>

      <div style={{ gap: '20px', marginTop: '20px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ marginBottom: '20px' }}>Видимые элементы</h2>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Количество видимых рядов:
            <input
              value={visibleRowsInput}
              onChange={handleInputChange(setVisibleRowsInput)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Количество видимых колонок:
            <input
              value={visibleColsInput}
              onChange={handleInputChange(setVisibleColsInput)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>

        <div>
          <h2 style={{ marginBottom: '20px' }}>Общее количество элементов</h2>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Всего рядов:
            <input
              value={totalRowsInput}
              onChange={handleInputChange(setTotalRowsInput)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Всего колонок:
            <input
              value={totalColsInput}
              onChange={handleInputChange(setTotalColsInput)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>
      </div>

      <button
        onClick={applySettings}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Применить
      </button>

      <button
        onClick={resetSettings}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#555',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Сбросить
      </button>
    </div>
  );
};
