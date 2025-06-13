import React from 'react';

import { useSettings } from 'context/settingsContext';

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

  // eslint-disable-next-line no-unused-vars
  const handleNumberChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setter(value);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Настройки стенда</h1>

      <div
        style={{
          gap: '20px',
          marginTop: '20px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ marginBottom: '20px' }}>Видимые элементы</h2>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Количество видимых рядов:
            <input
              type="number"
              min="1"
              value={visibleRowCount}
              onChange={handleNumberChange(setVisibleRowCount)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Количество видимых колонок:
            <input
              type="number"
              min="1"
              value={visibleColumnCount}
              onChange={handleNumberChange(setVisibleColumnCount)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>

        <div>
          <h2 style={{ marginBottom: '20px' }}>Общее количество элементов</h2>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Всего рядов:
            <input
              type="number"
              min="1"
              value={totalRowCount}
              onChange={handleNumberChange(setTotalRowCount)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            Всего колонок:
            <input
              type="number"
              min="1"
              value={totalColumnCount}
              onChange={handleNumberChange(setTotalColumnCount)}
              style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
