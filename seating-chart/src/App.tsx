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
  const [seatedPeople, setSeatedPeople] = useState<Set<string>>(new Set());

  const handleAssignmentChange = (personId: string, isSeated: boolean) => {
    setSeatedPeople(prev => {
      const updated = new Set(prev);
      if (isSeated) {
        updated.add(personId);
      } else {
        updated.delete(personId);
      }
      return updated;
    });
  };

  const unseatedPeople = people.filter(person => !seatedPeople.has(person.id));

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '32px', padding: '20px' }}>
        <PeopleList people={unseatedPeople} onGroupUpdate={setPeople} />
        <SeatingChart tables={defaultTables} onAssignmentChange={handleAssignmentChange} />
      </div>
    </DndProvider>
  );
};

export default App;
