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
  isRectangular?: boolean;
};

const Table: React.FC<Props> = ({ 
  name, 
  seatCount, 
  assignments, 
  onAssignPerson, 
  onRemovePerson,
  isRectangular = false
}) => {
  const tableWidth = isRectangular ? Math.max(400, seatCount * 70) : Math.max(240, seatCount * 40); // Wider for rectangular head table
  const tableHeight = isRectangular ? 200 : tableWidth; // Fixed height for rectangular, same as width for circular
  const radius = tableWidth / 2;
  const seatRadius = 35; // Size of each seat, further increased for better visibility

  return (
    <div style={{ 
      width: tableWidth, 
      height: tableHeight, 
      position: 'relative', 
      margin: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: isRectangular ? '10px' : '50%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#333', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{name}</h4>
      {Array.from({ length: seatCount }).map((_, i) => {
        const seatNumber = i + 1;
        let x, y;
        if (isRectangular) {
          // For rectangular table, place seats along the long edges
          const seatsPerSide = Math.ceil(seatCount / 2);
          if (i < seatsPerSide) {
            // Top side
            x = (tableWidth / seatsPerSide) * i + (tableWidth / seatsPerSide) / 2 - seatRadius;
            y = 10; // Near the top edge
          } else {
            // Bottom side
            const bottomIndex = i - seatsPerSide;
            x = (tableWidth / seatsPerSide) * bottomIndex + (tableWidth / seatsPerSide) / 2 - seatRadius;
            y = tableHeight - 10 - seatRadius * 2; // Near the bottom edge
          }
        } else {
          // Circular table positioning
          const angle = (i * (360 / seatCount)) * (Math.PI / 180); // Calculate angle in radians
          x = radius + radius * 0.65 * Math.cos(angle) - seatRadius;
          y = radius + radius * 0.65 * Math.sin(angle) - seatRadius;
        }
        
        return (
          <div 
            key={seatNumber}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: `${seatRadius * 2}px`,
              height: `${seatRadius * 2}px`,
              borderRadius: '50%',
              backgroundColor: assignments[seatNumber.toString()] ? '#5b507a' : '#e0e0e0',
              border: '2px solid #fff',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: assignments[seatNumber.toString()] ? '#fff' : '#666',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
          >
            <Seat
              seatNumber={seatNumber}
              assignedPerson={assignments[seatNumber.toString()] || null}
              onAssignPerson={(p) => onAssignPerson(seatNumber, p)}
              onRemovePerson={() => onRemovePerson(seatNumber)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Table;
