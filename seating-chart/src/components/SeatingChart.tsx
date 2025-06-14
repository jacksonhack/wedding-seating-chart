// src/components/SeatingChart.tsx
import React from 'react';

type TableConfig = {
  id: string;
  name: string;
  seatCount: number;
};

type SeatingChartProps = {
  tables: TableConfig[];
};

const SeatingChart: React.FC<SeatingChartProps> = ({ tables }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {tables.map(table => (
        <div key={table.id} style={{ border: '1px solid #ccc', padding: '8px' }}>
          <h3>{table.name}</h3>
          <ul>
            {Array.from({ length: table.seatCount }).map((_, i) => (
              <li key={i}>Seat {i + 1}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SeatingChart;
