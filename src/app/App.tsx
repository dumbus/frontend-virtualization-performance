import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ReactVirtualizedPage } from 'pages';
import { ReactVirtuosoPage } from 'pages';
import { ReactWindowPage } from 'pages';

import 'styles/styles.scss';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/react-virtualized"
          element={<ReactVirtualizedPage visibleColumnCount={10} visibleRowCount={10} />}
        />
        <Route path="/react-virtuoso" element={<ReactVirtuosoPage visibleColumnCount={10} visibleRowCount={10} />} />
        <Route path="/react-window" element={<ReactWindowPage visibleColumnCount={10} visibleRowCount={10} />} />
      </Routes>
    </Router>
  );
};

export default App;
