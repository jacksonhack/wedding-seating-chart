import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
};

type SeatProps = {
  seatNumber: number;
  assignedPerson: Person | null;
  onAssignPerson: (person: Person) => void;
};

const Seat: React.FC<SeatProps> = ({ seatNumber, assignedPerson, onAssignPerson }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'PERSON',
    drop: (item: Person) => {
      onAssignPerson(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Compose refs: attach both refs to the DOM node
  const setRefs = (node: HTMLLIElement | null) => {
    ref.current = node;
    drop(node);
  };

  return (
    <li
      ref={setRefs}
      style={{
        listStyle: 'none',
        padding: '8px',
        border: '1px solid #aaa',
        borderRadius: '4px',
        backgroundColor: assignedPerson ? '#def' : '#fff',
        minWidth: '100px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {assignedPerson
        ? `${assignedPerson.firstName} ${assignedPerson.lastName}`
        : `Seat ${seatNumber}`}
    </li>
  );
};

export default Seat;
