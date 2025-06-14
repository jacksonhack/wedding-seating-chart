import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
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

  // Sort people to group by groupId, with ungrouped at the end
  const sortedPeople = [...people].sort((a, b) => {
    if (a.groupId && !b.groupId) return -1;
    if (!a.groupId && b.groupId) return 1;
    if (a.groupId && b.groupId) return a.groupId.localeCompare(b.groupId);
    return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
  });

  const ungroup = () => {
    if (selected.size === 0) return;
    onGroupUpdate(
      people.map((p) =>
        selected.has(p.id) ? { ...p, groupId: null } : p
      )
    );
    setSelected(new Set());
  };

  return (
    <div>
      <h3>People</h3>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={group} disabled={selected.size < 2} style={{ marginRight: '10px' }}>
          Link Selected as Group
        </button>
        <button onClick={ungroup} disabled={selected.size === 0}>
          Ungroup Selected
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sortedPeople.map((p) => (
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
      ref={drag as unknown as React.Ref<HTMLLIElement>}
      onClick={onClick}
      style={{
        padding: '6px',
        margin: '4px 0',
        border: person.groupId ? `3px solid #${stringToColor(person.groupId)}` : (isSelected ? '2px solid #66b' : '1px solid #ccc'),
        background: isSelected ? '#def' : '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span style={{ marginRight: '8px', fontSize: '14px' }}>{isSelected ? '✓' : ' '}</span>
      {person.firstName} {person.lastName}
    </li>
  );
};

export default PeopleList;
