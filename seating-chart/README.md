# Wedding Seating Chart

A React-based application for planning seating arrangements for weddings or other events. This tool allows users to assign people to tables, manage groups, and persist their seating chart data server-side for access across devices.

## Features

- **Drag-and-Drop Interface**: Easily assign individuals or groups to seats using drag-and-drop functionality.
- **Group Management**: Link people into groups to ensure they are seated together, with visual indicators for grouped individuals.
- **Server-Side Persistence**: Save seating chart data to a backend server, allowing users to return to their work later, even from different devices.
- **Responsive Design**: Flexible layout that works on various screen sizes.

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm (Node Package Manager)

### Setup

1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd wedding-seating-chart
   ```

2. **Install Frontend Dependencies**:
   In the root directory (`seating-chart/`):
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   In the `seating-chart/server/` directory:
   ```bash
   cd server && npm install
   ```

## Running the Application

### Backend Server

Start the backend server to handle data persistence:

```bash
cd seating-chart/server && npm start
```

The server runs on `http://localhost:3001` by default. Ensure it's running before starting the frontend.

### Frontend Application

Start the React application:

```bash
cd seating-chart && npm run dev
```

The application will open in your default browser at `http://localhost:5173` (or another port if configured differently by Vite).

## Usage

- **Assigning People to Seats**: Drag individuals or groups from the "People" list to a seat on a table. If a person is part of a group, the entire group will be moved together if possible.
- **Removing People from Seats**: Click the "Remove" or "Remove Group" button on a seat to unassign an individual or an entire group.
- **Grouping People**: Select multiple people from the list by clicking on them, then click "Link Selected as Group" to group them together. Grouped individuals are visually distinct with colored borders.
- **Ungrouping People**: Select individuals from a group and click "Ungroup Selected" to remove them from the group.
- **Persistence**: Changes to the seating chart and people data are automatically saved to the backend server, allowing you to return to your work later.

## Project Structure

- **`src/`**: Contains the React frontend source code.
  - **`components/`**: UI components for the seating chart, tables, seats, and people list.
  - **`config/`**: Configuration files for table setups.
  - **`data/`**: Initial data for people.
- **`server/`**: Backend server code for data persistence.
  - **`index.js`**: Main server file using Express.js.
  - **`data.json`**: File where seating chart data is stored.

## Development

- **Frontend**: Uses React with TypeScript and Vite for fast development and build times. Modify components and logic in `src/`.
- **Backend**: A simple Express.js server for API endpoints to save and retrieve data. Extend or modify in `server/`.

## Troubleshooting

- **Server Not Running**: Ensure the backend server is started before the frontend app. If you encounter connection issues, verify the server is running on `http://localhost:3001`.
- **Data Not Persisting**: Check for errors in the browser console or server logs. Ensure write permissions are set for the `server/data.json` file.
- **Port Conflicts**: If ports `3001` or `5173` are in use, you may need to configure different ports in `server/index.js` or `vite.config.ts`.

## License

This project is licensed under the MIT License - see the LICENSE file for details (if applicable).

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for bugs, features, or improvements.
