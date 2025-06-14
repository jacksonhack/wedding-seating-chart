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
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
      <h3>Add New Person</h3>
      <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
        <input
          type="text"
          placeholder="First Name"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <button
          onClick={addPerson}
          disabled={newFirstName.trim() === '' || newLastName.trim() === ''}
        >
          Add Person
        </button>
      </div>
    </div>
  );
};

export default AddPersonForm;
