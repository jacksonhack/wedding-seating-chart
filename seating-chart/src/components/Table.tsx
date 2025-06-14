import React from 'react';
import Seat from './Seat';
import { type Person } from '../types';

type Props = {
  id: string;
  name: string;
  seatCount: number;
  assignments: { [seatNumber: string]: Person | null };
  onAssignPerson: (seatNumber: number, person: Person | Person[]) => void;
  onRemovePerson: (seatNumber: number) => void;
};

const Table: React.FC<Props> = ({ 
  name, 
  seatCount, 
  assignments, 
  onAssignPerson, 
  onRemovePerson 
}) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', width: '220px' }}>
      <h4>{name}</h4>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: 0 }}>
        {Array.from({ length: seatCount }).map((_, i) => {
          const seatNumber = i + 1;
          return (
            <Seat
              key={seatNumber}
              seatNumber={seatNumber}
              assignedPerson={assignments[seatNumber.toString()] || null}
              onAssignPerson={(p) => onAssignPerson(seatNumber, p)}
              onRemovePerson={() => onRemovePerson(seatNumber)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Table;
