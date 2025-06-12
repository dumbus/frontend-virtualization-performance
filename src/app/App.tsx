import { ReactVirtualizedPage } from 'pages';
import { ReactWindowPage } from 'pages';

import 'styles/styles.scss';

const App = () => {
  return <ReactVirtualizedPage visibleColumnCount={10} visibleRowCount={10} />;
};

export default App;
