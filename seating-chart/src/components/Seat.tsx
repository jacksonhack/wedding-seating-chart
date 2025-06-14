import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { type Person } from '../types';

type Props = {
  seatNumber: number;
  assignedPerson: Person | null;
  onAssignPerson: (p: Person | Person[]) => void;
};

const Seat: React.FC<Props> = ({ seatNumber, assignedPerson, onAssignPerson }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'PERSON_GROUP',
    drop: (item: { people: Person[] }) => {
      onAssignPerson(item.people);
    },
  });

  return (
    <li
      ref={(el) => {
        ref.current = el;
        drop(el);
      }}
      style={{
        border: '1px solid #888',
        borderRadius: '4px',
        padding: '6px',
        width: '100px',
        height: '40px',
        background: assignedPerson ? '#cff' : '#eee',
        textAlign: 'center',
        lineHeight: '28px',
      }}
    >
      {assignedPerson
        ? `${assignedPerson.firstName} ${assignedPerson.lastName}`
        : `Seat ${seatNumber}`}
    </li>
  );
};

export default Seat;
