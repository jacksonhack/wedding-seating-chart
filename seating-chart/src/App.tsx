import React, { useState, useEffect } from 'react';
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
  const [assignments, setAssignments] = useState<{ [tableId: string]: { [seatNumber: string]: Person | null } }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load initial state from server
    fetch('http://localhost:3001/api/seating-chart')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json();
      })
      .then(data => {
        if (data.people && data.people.length > 0) {
          setPeople(data.people);
        }
        if (data.assignments) {
          setAssignments(data.assignments);
          // Update seatedPeople based on assignments
          const seated = new Set<string>();
          for (const tableId in data.assignments) {
            for (const seatNum in data.assignments[tableId]) {
              const person = data.assignments[tableId][seatNum];
              if (person) {
                seated.add(person.id);
              }
            }
          }
          setSeatedPeople(seated);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      // Save state to server whenever it changes
      fetch('http://localhost:3001/api/seating-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments, people }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to save data');
          return response.json();
        })
        .then(data => {
          console.log(data.message);
        })
        .catch(error => {
          console.error('Error saving data:', error);
        });
    }
  }, [assignments, people, loading]);

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
        <SeatingChart 
          tables={defaultTables} 
          onAssignmentChange={handleAssignmentChange} 
          assignments={assignments} 
          onAssignmentsUpdate={setAssignments} 
        />
      </div>
    </DndProvider>
  );
};

export default App;
