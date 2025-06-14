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
  const ref = useRef<HTMLDivElement>(null);

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
    <div
      ref={(el: HTMLDivElement | null) => {
        ref.current = el;
        drop(el);
        if (assignedPerson) {
          drag(el);
        }
      }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        cursor: assignedPerson ? 'grab' : 'default',
        padding: '5px',
        boxSizing: 'border-box',
        color: assignedPerson ? '#fff' : '#666',
        fontSize: assignedPerson ? (assignedPerson.firstName.length + assignedPerson.lastName.length > 40 ? '0.6rem' : assignedPerson.firstName.length + assignedPerson.lastName.length > 30 ? '0.65rem' : assignedPerson.firstName.length + assignedPerson.lastName.length > 20 ? '0.7rem' : assignedPerson.firstName.length + assignedPerson.lastName.length > 15 ? '0.75rem' : '0.8rem') : '0.8rem',
        lineHeight: '1.2',
        backgroundColor: assignedPerson?.groupId ? `#${stringToColor(assignedPerson.groupId)}` : (assignedPerson ? '#5b507a' : 'transparent'),
        border: '2px solid #fff'
      }}
    >
      {assignedPerson ? (
        <>
          <span style={{ fontWeight: 'bold', maxWidth: '100%', whiteSpace: 'normal' }}>
            {`${assignedPerson.firstName} ${assignedPerson.lastName}`}
          </span>
          <button 
            onClick={onRemovePerson}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '11px',
              padding: 0,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              zIndex: 10
            }}
          >
            ✕
          </button>
        </>
      ) : (
        <span>{seatNumber}</span>
      )}
    </div>
  );
};

export default Seat;
