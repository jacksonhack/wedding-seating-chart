// src/components/SeatingChart.tsx
import React, { useState, useCallback } from 'react';
import Table from './Table';
import { type TableConfig } from '../config/tables';
import { type Person } from '../types';

type SeatingChartProps = {
  tables: TableConfig[];
  onAssignmentChange: (personId: string, tableId: string | null, seatPosition: number | null, ungroup: boolean) => void;
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
    personOrGroup: Person | Person[],
    seatPosition?: number
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
      personOrGroup.forEach((person, index) => {
        if (seatPosition) {
          // Check if the seat is occupied
          const targetSeat = seatPosition + index;
          const assignments = getTableAssignments(tableId);
          const currentOccupant = assignments[targetSeat.toString()];
          if (currentOccupant) {
            onAssignmentChange(currentOccupant.id, null, null, true); // Remove current occupant and ungroup them
          }
        }
        onAssignmentChange(person.id, tableId, seatPosition ? seatPosition + index : null, false);
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
          groupMembers.forEach((groupMember, index) => {
            if (seatPosition) {
              // Check if the seat is occupied
              const targetSeat = seatPosition + index;
              const assignments = getTableAssignments(tableId);
              const currentOccupant = assignments[targetSeat.toString()];
              if (currentOccupant) {
                onAssignmentChange(currentOccupant.id, null, null, true); // Remove current occupant and ungroup them
              }
            }
            onAssignmentChange(groupMember.id, tableId, seatPosition ? seatPosition + index : null, false);
          });
        } else {
          if (seatPosition) {
            // Check if the seat is occupied
            const assignments = getTableAssignments(tableId);
            const currentOccupant = assignments[seatPosition.toString()];
            if (currentOccupant) {
              onAssignmentChange(currentOccupant.id, null, null, true); // Remove current occupant and ungroup them
            }
          }
          onAssignmentChange(person.id, tableId, seatPosition || null, false);
        }
      } else {
        if (seatPosition) {
          // Check if the seat is occupied
          const assignments = getTableAssignments(tableId);
          const currentOccupant = assignments[seatPosition.toString()];
          if (currentOccupant) {
            onAssignmentChange(currentOccupant.id, null, null, true); // Remove current occupant and ungroup them
          }
        }
        onAssignmentChange(person.id, tableId, seatPosition || null, false);
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
          onAssignmentChange(groupMember.id, null, null, false);
        });
      } else {
        onAssignmentChange(personId, null, null, false);
      }
    }
  }, [people, onAssignmentChange]);

  // Create assignments object for each table based on people assigned to it, respecting seatPosition if available
  const getTableAssignments = (tableId: string) => {
    const assignedPeople = people.filter(p => p.assigned_table === tableId);
    const assignments: { [seatNumber: string]: Person | null } = {};
    const table = tables.find(t => t.id === tableId);
    
    // First, try to place people in their specified seat positions
    assignedPeople.forEach(person => {
      if (person.seatPosition && table && person.seatPosition <= table.seatCount) {
        assignments[person.seatPosition.toString()] = person;
      }
    });
    
    // Then, fill in any gaps with people who don't have a specific seat position
    let nextSeat = 1;
    assignedPeople.forEach(person => {
      if (!person.seatPosition && table && nextSeat <= table.seatCount) {
        while (assignments[nextSeat.toString()]) {
          nextSeat++;
        }
        if (nextSeat <= table.seatCount) {
          assignments[nextSeat.toString()] = person;
          nextSeat++;
        }
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
              assignPersonToTable(table.id, person, seatNumber)
            }
            onRemovePerson={(seatNumber) => {
              const assignments = getTableAssignments(table.id);
              const personToRemove = assignments[seatNumber.toString()];
              if (personToRemove) {
                removePersonFromTable(personToRemove.id);
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
