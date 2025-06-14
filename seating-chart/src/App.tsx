import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PeopleList from './components/PeopleList';
import SeatingChart from './components/SeatingChart';
import { type Person } from './types';
import { defaultTables } from './config/tables';
import peopleData from './data/people.json'

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>(peopleData);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '32px', padding: '20px' }}>
        <PeopleList people={people} onGroupUpdate={setPeople} />
        <SeatingChart tables={defaultTables} />
      </div>
    </DndProvider>
  );
};

export default App;
