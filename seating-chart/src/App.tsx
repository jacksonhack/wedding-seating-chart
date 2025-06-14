import React from 'react';
import SeatingChart from './components/SeatingChart';
import { defaultTables } from './config/tables';

const App: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Wedding Seating Chart</h1>
      <SeatingChart tables={defaultTables} />
    </div>
  );
};

export default App;