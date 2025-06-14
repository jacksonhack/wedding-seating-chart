/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Table.tsx
import React from 'react';
import Seat from './Seat';

type TableProps = {
  id: string;
  name: string;
  seatCount: number;
};

const Table: React.FC<TableProps> = ({ id, name, seatCount }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '8px',
      width: '180px',
    }}>
      <h4>{name}</h4>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
      }}>
        {Array.from({ length: seatCount }).map((_, i) => (
          <Seat key={i} seatNumber={i + 1} />
        ))}
      </div>
    </div>
  );
};

export default Table;
