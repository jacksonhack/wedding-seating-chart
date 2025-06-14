import React, { useState } from 'react';
import { type Person } from '../types';

type Props = {
  onAddPerson: (person: Person) => void;
};

const AddPersonForm: React.FC<Props> = ({ onAddPerson }) => {
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  const addPerson = () => {
    if (newFirstName.trim() === '' || newLastName.trim() === '') return;
    const newPerson = {
      id: `person-${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      groupId: null
    };
    onAddPerson(newPerson);
    setNewFirstName('');
    setNewLastName('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Add New Person</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="First Name"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
          style={{ padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
          style={{ padding: '5px' }}
        />
        <button
          onClick={addPerson}
          disabled={newFirstName.trim() === '' || newLastName.trim() === ''}
          style={{ padding: '5px 10px' }}
        >
          Add Person
        </button>
      </div>
    </div>
  );
};

export default AddPersonForm;
