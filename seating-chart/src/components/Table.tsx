/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Seat from './Seat';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
};

type TableProps = {
  id: string;
  name: string;
  seatCount: number;
};

type SeatAssignment = {
  [seatNumber: string]: Person | null;
};

const Table: React.FC<TableProps> = ({ id, name, seatCount }) => {
  const [assignments, setAssignments] = useState<SeatAssignment>({});

  const handleAssignPerson = (seatNumber: number, person: Person) => {
    setAssignments((prev) => ({
      ...prev,
      [seatNumber]: person,
    }));
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px',
        width: '180px',
      }}
    >
      <h4>{name}</h4>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {Array.from({ length: seatCount }).map((_, i) => {
          const seatNumber = i + 1;
          return (
            <Seat
              key={seatNumber}
              seatNumber={seatNumber}
              assignedPerson={assignments[seatNumber]}
              onAssignPerson={(person) => handleAssignPerson(seatNumber, person)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Table;
