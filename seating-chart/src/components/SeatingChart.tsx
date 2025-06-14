// src/components/SeatingChart.tsx
import React, { useState, useCallback } from 'react';
import Table from './Table';
import { type TableConfig } from '../config/tables';
import { type Person } from '../types';

type SeatingChartProps = {
  tables: TableConfig[];
  onAssignmentChange?: (personId: string, isSeated: boolean) => void;
};

// Type for tracking all seat assignments across tables
type GlobalAssignments = {
  [tableId: string]: {
    [seatNumber: string]: Person | null;
  };
};

const SeatingChart: React.FC<SeatingChartProps> = ({ tables, onAssignmentChange }) => {
  // Centralized state for all table assignments
  const [globalAssignments, setGlobalAssignments] = useState<GlobalAssignments>({});

  // Initialize table assignments if not already present
  tables.forEach(table => {
    if (!globalAssignments[table.id]) {
      globalAssignments[table.id] = {};
    }
  });

  // Function to assign a person to a seat
  const assignPersonToSeat = useCallback((
    tableId: string, 
    seatNumber: number, 
    personOrGroup: Person | Person[]
  ) => {
    setGlobalAssignments(prev => {
      const next = { ...prev };
      
      // Ensure the table exists in our state
      if (!next[tableId]) {
        next[tableId] = {};
      }
      
      // Handle group assignment
      if (Array.isArray(personOrGroup)) {
        personOrGroup.forEach((person, i) => {
          const targetSeatNumber = (seatNumber + i).toString();
          
          // First, remove this person from any existing seat
          for (const tId in next) {
            for (const sNum in next[tId]) {
              if (next[tId][sNum]?.id === person.id) {
                next[tId][sNum] = null;
                onAssignmentChange?.(person.id, false);
              }
            }
          }
          
          // Then assign to the new seat
          next[tableId][targetSeatNumber] = person;
          onAssignmentChange?.(person.id, true);
        });
      } 
      // Handle single person assignment
      else {
        const person = personOrGroup;
        const targetSeatNumber = seatNumber.toString();
        
        // First, remove this person from any existing seat
        for (const tId in next) {
          for (const sNum in next[tId]) {
            if (next[tId][sNum]?.id === person.id) {
              next[tId][sNum] = null;
              onAssignmentChange?.(person.id, false);
            }
          }
        }
        
        // Then assign to the new seat
        next[tableId][targetSeatNumber] = person;
        onAssignmentChange?.(person.id, true);
      }
      
      return next;
    });
  }, []);

  // Function to remove a person from a seat
  const removePersonFromSeat = useCallback((tableId: string, seatNumber: number) => {
    setGlobalAssignments(prev => {
      const next = { ...prev };
      const person = next[tableId]?.[seatNumber.toString()];
      if (person) {
        onAssignmentChange?.(person.id, false);
        next[tableId][seatNumber.toString()] = null;
      }
      return next;
    });
  }, [onAssignmentChange]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {tables.map(table => (
        <Table
          key={table.id}
          id={table.id}
          name={table.name}
          seatCount={table.seatCount}
          assignments={globalAssignments[table.id] || {}}
          onAssignPerson={(seatNumber, person) => 
            assignPersonToSeat(table.id, seatNumber, person)
          }
          onRemovePerson={(seatNumber) => 
            removePersonFromSeat(table.id, seatNumber)
          }
        />
      ))}
    </div>
  );
};

export default SeatingChart;
