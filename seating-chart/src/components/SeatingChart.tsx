// src/components/SeatingChart.tsx
import React, { useState, useCallback, useEffect } from 'react';
import Table from './Table';
import { type TableConfig } from '../config/tables';
import { type Person } from '../types';

type SeatingChartProps = {
  tables: TableConfig[];
  onAssignmentChange?: (personId: string, isSeated: boolean) => void;
  assignments?: GlobalAssignments;
  onAssignmentsUpdate?: (assignments: GlobalAssignments) => void;
};

// Type for tracking all seat assignments across tables
type GlobalAssignments = {
  [tableId: string]: {
    [seatNumber: string]: Person | null;
  };
};

const SeatingChart: React.FC<SeatingChartProps> = ({ tables, onAssignmentChange, assignments = {}, onAssignmentsUpdate }) => {
  // Centralized state for all table assignments
  const [globalAssignments, setGlobalAssignments] = useState<GlobalAssignments>(assignments);
  
  useEffect(() => {
    setGlobalAssignments(assignments);
  }, [assignments]);
  
  useEffect(() => {
    onAssignmentsUpdate?.(globalAssignments);
  }, [globalAssignments, onAssignmentsUpdate]);

  // Initialize table assignments if not already present
  tables.forEach(table => {
    if (!globalAssignments[table.id]) {
      globalAssignments[table.id] = {};
    }
  });

  // Function to assign a person or group to seats
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
      
      // Determine if it's a single person or a group from the drag item
      const isGroupDrag = Array.isArray(personOrGroup) && personOrGroup.length > 1;
      if (isGroupDrag) {
        // Handle group assignment from PeopleList
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
      } else {
        // Handle single person drag, check if part of a group
        const person = Array.isArray(personOrGroup) ? personOrGroup[0] : personOrGroup;
        if (person.groupId) {
          // Find all seated members of this group
          const groupMembers: Person[] = [];
          for (const tId in prev) {
            for (const sNum in prev[tId]) {
              if (prev[tId][sNum]?.groupId === person.groupId) {
                groupMembers.push(prev[tId][sNum] as Person);
              }
            }
          }
          // Remove all group members from current seats
          for (const tId in next) {
            for (const sNum in next[tId]) {
              const seatedPerson = next[tId][sNum];
              if (seatedPerson && seatedPerson.groupId === person.groupId) {
                next[tId][sNum] = null;
                onAssignmentChange?.(seatedPerson.id, false);
              }
            }
          }
          // Find a block of consecutive empty seats for the group
          let startSeat = seatNumber;
          let foundBlock = false;
          const tableSeats = tables.find(t => t.id === tableId)?.seatCount || 0;
          while (startSeat <= tableSeats - groupMembers.length) {
            let canPlace = true;
            for (let i = 0; i < groupMembers.length; i++) {
              const checkSeat = (startSeat + i).toString();
              if (next[tableId][checkSeat]) {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              foundBlock = true;
              break;
            }
            startSeat++;
          }
          // If a block is found, assign group members to new seats
          if (foundBlock) {
            groupMembers.forEach((groupMember, i) => {
              const targetSeatNumber = (startSeat + i).toString();
              next[tableId][targetSeatNumber] = groupMember;
              onAssignmentChange?.(groupMember.id, true);
            });
          } else {
            // If no block is found on this table, do not assign (keep removed)
            // Optionally, could search other tables, but for simplicity, do nothing
          }
        } else {
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
      }
      
      return next;
    });
  }, [tables]);

  // Function to remove a person or group from seats
  const removePersonFromSeat = useCallback((tableId: string, seatNumber: number) => {
    setGlobalAssignments(prev => {
      const next = { ...prev };
      const person = next[tableId]?.[seatNumber.toString()];
      if (person) {
        if (person.groupId) {
          // Remove all members of the group
          for (const tId in next) {
            for (const sNum in next[tId]) {
              if (next[tId][sNum]?.groupId === person.groupId) {
                onAssignmentChange?.(next[tId][sNum]?.id || '', false);
                next[tId][sNum] = null;
              }
            }
          }
        } else {
          onAssignmentChange?.(person.id, false);
          next[tableId][seatNumber.toString()] = null;
        }
      }
      return next;
    });
  }, [onAssignmentChange]);

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '20px', 
      justifyContent: 'center',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      padding: '10px'
    }}>
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
            assignments={globalAssignments[table.id] || {}}
            onAssignPerson={(seatNumber, person) => 
              assignPersonToSeat(table.id, seatNumber, person)
            }
            onRemovePerson={(seatNumber) => 
              removePersonFromSeat(table.id, seatNumber)
            }
            isRectangular={table.name.toLowerCase().includes('head')}
          />
        </div>
      ))}
    </div>
  );
};

export default SeatingChart;
