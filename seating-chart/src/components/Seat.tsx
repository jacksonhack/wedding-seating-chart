import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { type Person } from '../types';

type Props = {
  seatNumber: number;
  assignedPerson: Person | null;
  onAssignPerson: (p: Person | Person[]) => void;
  onRemovePerson: () => void;
};

const Seat: React.FC<Props> = ({ seatNumber, assignedPerson, onAssignPerson, onRemovePerson }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'PERSON_GROUP',
    drop: (item: { people: Person[] }) => {
      onAssignPerson(item.people);
    },
  });

  const [, drag] = useDrag({
    type: 'PERSON_GROUP',
    item: assignedPerson ? { people: [assignedPerson] } : null,
    canDrag: !!assignedPerson,
  });

  return (
    <li
      ref={(el) => {
        ref.current = el;
        drop(el);
        if (assignedPerson) {
          drag(el);
        }
      }}
      style={{
        border: '1px solid #888',
        borderRadius: '4px',
        padding: '6px',
        width: '100px',
        height: assignedPerson ? '60px' : '40px',
        background: assignedPerson ? '#cff' : '#eee',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {assignedPerson ? (
        <div>
          <div style={{ marginBottom: '4px' }}>
            {`${assignedPerson.firstName} ${assignedPerson.lastName}`}
          </div>
          <button 
            onClick={onRemovePerson}
            style={{
              fontSize: '12px',
              padding: '2px 6px',
              cursor: 'pointer',
              background: '#ffdddd',
              border: '1px solid #ff9999',
              borderRadius: '3px'
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div style={{ lineHeight: '40px' }}>
          {`Seat ${seatNumber}`}
        </div>
      )}
    </li>
  );
};

export default Seat;
