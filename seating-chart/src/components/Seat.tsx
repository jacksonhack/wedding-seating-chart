import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { type Person } from '../types';

// Simple hash function to generate a color from a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
};

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
        border: assignedPerson?.groupId ? `3px solid #${stringToColor(assignedPerson.groupId)}` : '1px solid #888',
        borderRadius: '4px',
        padding: '6px',
        width: '100px',
        height: assignedPerson ? '60px' : '40px',
        background: assignedPerson ? '#cff' : '#eee',
        textAlign: 'center',
        position: 'relative',
        cursor: assignedPerson ? 'grab' : 'default',
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
            {assignedPerson.groupId ? 'Unseat Group' : 'Unseat Person'}
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
