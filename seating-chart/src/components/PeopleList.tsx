import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  groupId?: string | null;
};

type PeopleListProps = {
  people: Person[];
};

const PeopleList: React.FC<PeopleListProps> = ({ people }) => {
  return (
    <ul style={{ padding: 0 }}>
      {people.map((person) => (
        <DraggablePerson key={person.id} person={person} />
      ))}
    </ul>
  );
};

type DraggablePersonProps = {
  person: Person;
};

const DraggablePerson: React.FC<DraggablePersonProps> = ({ person }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drag] = useDrag({
    type: 'PERSON',
    item: person,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Compose refs
  const setRefs = (node: HTMLLIElement | null) => {
    ref.current = node;
    drag(node);
  };

  return (
    <li
      ref={setRefs}
      style={{
        listStyle: 'none',
        padding: '8px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginBottom: '6px',
        backgroundColor: '#eee',
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      {person.firstName} {person.lastName}
    </li>
  );
};

export default PeopleList;
