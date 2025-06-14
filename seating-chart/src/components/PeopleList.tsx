import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { type Person } from '../types';

type Props = {
  people: Person[];
  onGroupUpdate: (updated: Person[]) => void;
};

const PeopleList: React.FC<Props> = ({ people, onGroupUpdate }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const group = () => {
    if (selected.size < 2) return;
    const groupId = `group-${Date.now()}`;
    onGroupUpdate(
      people.map((p) =>
        selected.has(p.id) ? { ...p, groupId } : p
      )
    );
    setSelected(new Set());
  };

  return (
    <div>
      <h3>People</h3>
      <button onClick={group} disabled={selected.size < 2}>
        Link Selected as Group
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {people.map((p) => (
          <DraggablePerson
            key={p.id}
            person={p}
            isSelected={selected.has(p.id)}
            onClick={() => toggle(p.id)}
            people={people}
          />
        ))}
      </ul>
    </div>
  );
};

const DraggablePerson = ({
  person,
  isSelected,
  onClick,
  people,
}: {
  person: Person;
  isSelected: boolean;
  onClick: () => void;
  people: Person[];
}) => {
  const dragGroup = person.groupId
    ? people.filter((p) => p.groupId === person.groupId)
    : [person];

  const [, drag] = useDrag({
    type: 'PERSON_GROUP',
    item: { people: dragGroup },
  });

  return (
    <li
      ref={drag}
      onClick={onClick}
      style={{
        padding: '6px',
        margin: '4px 0',
        border: '1px solid #ccc',
        background: isSelected ? '#def' : '#fff',
        cursor: 'pointer',
      }}
    >
      {person.firstName} {person.lastName}
      {person.groupId ? ` (Group)` : ''}
    </li>
  );
};

export default PeopleList;
