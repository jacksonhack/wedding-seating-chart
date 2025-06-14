const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(express.json());
app.use(cors());

// Ensure data file exists with initial data
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    assignments: {},
    people: require('../src/data/people.json')
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
} else {
  // Check if the file is empty or corrupted and reinitialize if needed
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!data.people || data.people.length === 0) {
      const initialData = {
        assignments: data.assignments || {},
        people: require('../src/data/people.json')
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error reading data file, reinitializing:', error);
    const initialData = {
      assignments: {},
      people: require('../src/data/people.json')
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// API to get the current seating chart state
app.get('/api/seating-chart', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to load seating chart data' });
  }
});

// API to save the seating chart state
app.post('/api/seating-chart', (req, res) => {
  try {
    const { assignments, people } = req.body;
    const data = { assignments, people };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ message: 'Seating chart saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save seating chart data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
