import React from 'react';
import SeatingChart from './components/SeatingChart';
import PeopleList from './components/PeopleList';
import { defaultTables } from './config/tables';
import peopleData from './data/people.json';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '40px', padding: '24px' }}>
      <PeopleList people={peopleData} />
      <SeatingChart tables={defaultTables} />
    </div>
  );
};

export default App;
