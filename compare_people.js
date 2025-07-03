const fs = require('fs');

// Read the JSON files
const editedData = JSON.parse(fs.readFileSync('edited.json', 'utf8'));
const peopleData = JSON.parse(fs.readFileSync('seating-chart/src/data/people.json', 'utf8'));

// Extract IDs from edited.json's people array
const peopleIdsInEdited = editedData.people.map(person => person.id);

// Extract IDs from all table assignments in edited.json
const assignmentIds = [];
Object.values(editedData.assignments).forEach(table => {
  Object.values(table).forEach(seat => {
    if (seat && seat.id) {
      assignmentIds.push(seat.id);
    }
  });
});

// Combine IDs from people array and assignments, removing duplicates
const allEditedIds = [...new Set([...peopleIdsInEdited, ...assignmentIds])];

// Extract IDs from people.json
const peopleIds = peopleData.map(person => person.id);

// Find IDs in people.json that are not in edited.json's people array or assignments
const missingIds = peopleIds.filter(id => !allEditedIds.includes(id));

// Get full records of missing people
const missingPeople = peopleData.filter(person => missingIds.includes(person.id));

// Output the missing people
if (missingPeople.length > 0) {
  console.log('Missing people (not in people array nor at any table):');
  missingPeople.forEach(person => {
    console.log(`- ${person.firstName} ${person.lastName} (ID: ${person.id})`);
  });
} else {
  console.log('No missing people found.');
}
