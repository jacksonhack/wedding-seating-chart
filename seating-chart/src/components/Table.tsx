import React, { useState } from 'react';
import Seat from './Seat';
import { type Person } from '../types';

type Props = {
  id: string;
  name: string;
  seatCount: number;
};

type SeatAssignment = {
  [seatNumber: string]: Person | null;
};

const Table: React.FC<Props> = ({ name, seatCount }) => {
  const [assignments, setAssignments] = useState<SeatAssignment>({});

  const assign = (seatNumber: number, personOrGroup: Person | Person[]) => {
    setAssignments((prev) => {
      const next = { ...prev };
      if (Array.isArray(personOrGroup)) {
        personOrGroup.forEach((p, i) => {
          next[(seatNumber + i).toString()] = p;
        });
      } else {
        next[seatNumber.toString()] = personOrGroup;
      }
      return next;
    });
  };

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
              onAssignPerson={(p) => assign(seatNumber, p)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Table;
