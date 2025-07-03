// src/components/SeatingChart.tsx
import React, { useState, useCallback } from 'react';
import Table from './Table';
import { type TableConfig } from '../config/tables';
import { type Person } from '../types';

type SeatingChartProps = {
  tables: TableConfig[];
  onAssignmentChange: (personId: string, tableId: string | null) => void;
  people: Person[];
};

const SeatingChart: React.FC<SeatingChartProps> = ({ tables, onAssignmentChange, people }) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Function to check if a group can fit on a table starting from a seat, considering circular arrangement for non-rectangular tables
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const canGroupFit = (tableId: string, groupSize: number, assignedPeople: Person[]): boolean => {
    const table = tables.find(t => t.id === tableId);
    const tableSeats = table?.seatCount || 0;
    
    const assignedSeats = assignedPeople.filter(p => p.assigned_table === tableId).length;
    if (assignedSeats + groupSize > tableSeats) return false;

    return true; // Simplified check since we're not tracking specific seats anymore
  };

  // Function to assign a person or group to a table
  const assignPersonToTable = useCallback((
    tableId: string, 
    personOrGroup: Person | Person[]
  ) => {
    // Determine if it's a single person or a group from the drag item
    const isGroupDrag = Array.isArray(personOrGroup) && personOrGroup.length > 1;
    if (isGroupDrag) {
      const groupSize = personOrGroup.length;
      if (!canGroupFit(tableId, groupSize, people)) {
        setWarningMessage(`Cannot place group: Not enough seats available on this table.`);
        setTimeout(() => setWarningMessage(null), 3000);
        return;
      }
      personOrGroup.forEach(person => {
        onAssignmentChange(person.id, tableId);
      });
    } else {
      const person = Array.isArray(personOrGroup) ? personOrGroup[0] : personOrGroup;
      if (person.groupId) {
        const groupMembers = people.filter(p => p.groupId === person.groupId);
        if (groupMembers.length > 1) {
          if (!canGroupFit(tableId, groupMembers.length, people)) {
            setWarningMessage(`Cannot place group: Not enough seats available on this table.`);
            setTimeout(() => setWarningMessage(null), 3000);
            return;
          }
          groupMembers.forEach(groupMember => {
            onAssignmentChange(groupMember.id, tableId);
          });
        } else {
          onAssignmentChange(person.id, tableId);
        }
      } else {
        onAssignmentChange(person.id, tableId);
      }
    }
  }, [people, onAssignmentChange, canGroupFit]);

  // Function to remove a person or group from a table
  const removePersonFromTable = useCallback((personId: string) => {
    const person = people.find(p => p.id === personId);
    if (person) {
      if (person.groupId) {
        const groupMembers = people.filter(p => p.groupId === person.groupId);
        groupMembers.forEach(groupMember => {
          onAssignmentChange(groupMember.id, null);
        });
      } else {
        onAssignmentChange(personId, null);
      }
    }
  }, [people, onAssignmentChange]);

  // Create assignments object for each table based on people assigned to it
  const getTableAssignments = (tableId: string) => {
    const assignedPeople = people.filter(p => p.assigned_table === tableId);
    const assignments: { [seatNumber: string]: Person | null } = {};
    const table = tables.find(t => t.id === tableId);
    assignedPeople.forEach((person, index) => {
      if (table && index < table.seatCount) {
        assignments[(index + 1).toString()] = person;
      }
    });
    return assignments;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '20px', 
      justifyContent: 'center',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      padding: '10px',
      position: 'relative'
    }}>
      {warningMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          maxWidth: '300px',
          textAlign: 'center'
        }}>
          {warningMessage}
        </div>
      )}
      {tables.map((table) => (
        <div key={table.id} style={{
          flex: table.name.toLowerCase().includes('head') ? '1 1 100%' : '0 1 calc(33.33% - 40px)',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <Table
            id={table.id}
            name={table.name}
            seatCount={table.seatCount}
            assignments={getTableAssignments(table.id)}
            onAssignPerson={(seatNumber, person) => 
              assignPersonToTable(table.id, person)
            }
            onRemovePerson={(seatNumber) => {
              const assignedPeople = people.filter(p => p.assigned_table === table.id);
              if (assignedPeople.length > seatNumber - 1) {
                const personToRemove = assignedPeople[seatNumber - 1];
                if (personToRemove) {
                  removePersonFromTable(personToRemove.id);
                }
              }
            }}
            isRectangular={table.name.toLowerCase().includes('head')}
          />
        </div>
      ))}
    </div>
  );
};

export default SeatingChart;
