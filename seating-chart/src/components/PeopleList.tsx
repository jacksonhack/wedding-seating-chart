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
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Filter people based on search term
  const filteredPeople = people.filter(person => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Sort people to group by groupId, with ungrouped at the end
  const sortedPeople = [...filteredPeople].sort((a, b) => {
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
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' }}>
        <h3 style={{ margin: 0, marginBottom: '15px' }}>Guests</h3>
        <input
          type="text"
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            marginBottom: '15px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={group} disabled={selected.size < 2}>
            Link as Group
          </button>
          <button onClick={ungroup} disabled={selected.size === 0}>
            Ungroup Selected
          </button>
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flex: 1 }}>
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
        padding: '12px 15px',
        margin: '5px 0',
        border: person.groupId ? `3px solid #${stringToColor(person.groupId)}` : (isSelected ? '2px solid #5b507a' : '1px solid #e0e0e0'),
        background: isSelected ? '#f0eaff' : '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        boxShadow: isSelected ? '0 2px 6px rgba(91, 80, 122, 0.2)' : 'none'
      }}
    >
      <span style={{ marginRight: '12px', fontSize: '1rem', color: isSelected ? '#5b507a' : '#333', fontWeight: isSelected ? 'bold' : 'normal' }}>{isSelected ? '✓' : ' '}</span>
      <span style={{ fontSize: '1rem', fontWeight: '500' }}>{person.firstName} {person.lastName}</span>
    </li>
  );
};

export default PeopleList;
