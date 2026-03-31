import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SettingsContextProvider } from 'context';
import { MainPage } from 'pages';
import { AgGridPage } from 'pages';
import { HandsontablePage } from 'pages';
import { ReactVirtualizedPage } from 'pages';
import { ReactVirtuosoPage } from 'pages';
import { ReactWindowPage } from 'pages';
import { SlickGridPage } from 'pages';
import { TanstackVirtualPage } from 'pages';
import { CustomCssContentVisibilityPage } from 'pages';
import { CustomObserverApiPage } from 'pages';
import { Header } from 'widgets';

import 'styles/styles.scss';

const App = () => {
  return (
    <SettingsContextProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Header />

        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/ag-grid" element={<AgGridPage />} />
          <Route path="/handsontable" element={<HandsontablePage />} />
          <Route path="/react-virtualized" element={<ReactVirtualizedPage />} />
          <Route path="/react-virtuoso" element={<ReactVirtuosoPage />} />
          <Route path="/react-window" element={<ReactWindowPage />} />
          <Route path="/slickgrid" element={<SlickGridPage />} />
          <Route path="/tanstack-virtual" element={<TanstackVirtualPage />} />

          <Route path="/css-content-visibility" element={<CustomCssContentVisibilityPage />} />
          <Route path="/custom-observer-api" element={<CustomObserverApiPage />} />
        </Routes>
      </Router>
    </SettingsContextProvider>
  );
};

export default App;
