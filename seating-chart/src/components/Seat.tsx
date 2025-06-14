// src/components/Seat.tsx
import React from 'react';

type SeatProps = {
  seatNumber: number;
};

const Seat: React.FC<SeatProps> = ({ seatNumber }) => {
  return (
    <div style={{
      width: '32px',
      height: '32px',
      border: '1px solid #666',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
    }}>
      {seatNumber}
    </div>
  );
};

export default Seat;
