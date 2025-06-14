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
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
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

  // Function to check if a group can fit on a table starting from a seat, considering circular arrangement for non-rectangular tables
  const canGroupFit = (tableId: string, startSeat: number, groupSize: number, currentAssignments: GlobalAssignments): boolean => {
    const table = tables.find(t => t.id === tableId);
    const tableSeats = table?.seatCount || 0;
    const isRectangular = table?.name.toLowerCase().includes('head') || false;
    
    if (isRectangular) {
      // For rectangular tables, no wrapping
      if (startSeat + groupSize - 1 > tableSeats) return false;
      for (let i = 0; i < groupSize; i++) {
        const seatToCheck = (startSeat + i).toString();
        if (currentAssignments[tableId][seatToCheck]) {
          return false;
        }
      }
      return true;
    } else {
      // For circular tables, check with wrapping
      for (let i = 0; i < groupSize; i++) {
        const seatIndex = (startSeat + i - 1) % tableSeats + 1;
        const seatToCheck = seatIndex.toString();
        if (currentAssignments[tableId][seatToCheck]) {
          return false;
        }
      }
      return true;
    }
  };

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
        // Check if the group can fit starting from the selected seat
        const canFit = canGroupFit(tableId, seatNumber, personOrGroup.length, prev);
        const isRectangularTable = tables.find(t => t.id === tableId)?.name.toLowerCase().includes('head') || false;
        let startSeat = seatNumber;
        if (!canFit) {
          // For circular tables, check if any starting position works with wrapping
          const tableSeats = tables.find(t => t.id === tableId)?.seatCount || 0;
          let foundValidStart = false;
          if (!isRectangularTable) {
            for (let start = 1; start <= tableSeats; start++) {
              let canPlace = true;
              for (let i = 0; i < personOrGroup.length; i++) {
                const seatIndex = (start + i - 1) % tableSeats + 1;
                const checkSeat = seatIndex.toString();
                if (prev[tableId][checkSeat]) {
                  canPlace = false;
                  break;
                }
              }
              if (canPlace) {
                foundValidStart = true;
                startSeat = start;
                break;
              }
            }
          }
          if (!foundValidStart) {
            return prev; // Do not update assignments
          }
        }
        
        // Handle group assignment from PeopleList
        const isRectangular = tables.find(t => t.id === tableId)?.name.toLowerCase().includes('head') || false;
        const tableSeats = tables.find(t => t.id === tableId)?.seatCount || 0;
        personOrGroup.forEach((person, i) => {
          const targetSeatIndex = isRectangular ? startSeat + i : (startSeat + i - 1) % tableSeats + 1;
          const targetSeatNumber = targetSeatIndex.toString();
          
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
          
          if (groupMembers.length > 1) {
            // Check if the group can fit starting from the selected seat
            const canFitGroup = canGroupFit(tableId, seatNumber, groupMembers.length, prev);
            let startSeat = seatNumber;
            if (!canFitGroup) {
              // For circular tables, check if any starting position works with wrapping
              const tableSeats = tables.find(t => t.id === tableId)?.seatCount || 0;
              const isRectangularTableGroup = tables.find(t => t.id === tableId)?.name.toLowerCase().includes('head') || false;
              let foundValidStart = false;
              if (!isRectangularTableGroup) {
                for (let start = 1; start <= tableSeats; start++) {
                  let canPlace = true;
                  for (let i = 0; i < groupMembers.length; i++) {
                    const seatIndex = (start + i - 1) % tableSeats + 1;
                    const checkSeat = seatIndex.toString();
                    if (prev[tableId][checkSeat]) {
                      canPlace = false;
                      break;
                    }
                  }
                  if (canPlace) {
                    foundValidStart = true;
                    startSeat = start;
                    break;
                  }
                }
              }
              if (!foundValidStart) {
                setWarningMessage(`Cannot place group: Not enough consecutive seats available on this table.`);
                setTimeout(() => setWarningMessage(null), 3000);
                return prev; // Do not update assignments
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
          // Find a block of consecutive empty seats for the group, considering circular arrangement
          let startSeat = seatNumber;
          let foundBlock = false;
          const tableSeats = tables.find(t => t.id === tableId)?.seatCount || 0;
          const isRectangular = tables.find(t => t.id === tableId)?.name.toLowerCase().includes('head') || false;
          
          if (isRectangular) {
            // For rectangular tables, linear search
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
          } else {
            // For circular tables, check wrapping around
            for (let attempt = 0; attempt < tableSeats; attempt++) {
              let canPlace = true;
              for (let i = 0; i < groupMembers.length; i++) {
                const seatIndex = (startSeat + i - 1) % tableSeats + 1;
                const checkSeat = seatIndex.toString();
                if (next[tableId][checkSeat]) {
                  canPlace = false;
                  break;
                }
              }
              if (canPlace) {
                foundBlock = true;
                break;
              }
              startSeat = (startSeat % tableSeats) + 1;
            }
          }
          
          // Assign group members to new seats using the found start seat
          groupMembers.forEach((groupMember, i) => {
            const targetSeatIndex = isRectangular ? startSeat + i : (startSeat + i - 1) % tableSeats + 1;
            const targetSeatNumber = targetSeatIndex.toString();
            next[tableId][targetSeatNumber] = groupMember;
            onAssignmentChange?.(groupMember.id, true);
          });
        } else {
          const targetSeatNumber = seatNumber.toString();
          
          // Check if the seat is already occupied
          if (next[tableId][targetSeatNumber]) {
            setWarningMessage(`Cannot place person: Seat ${seatNumber} is already occupied.`);
            setTimeout(() => setWarningMessage(null), 3000);
            return prev; // Do not update assignments
          }
          
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
