// src/components/SeatingChart.tsx
import React from 'react';
import Table from './Table';
import { type TableConfig } from '../config/tables';

type SeatingChartProps = {
  tables: TableConfig[];
};

const SeatingChart: React.FC<SeatingChartProps> = ({ tables }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {tables.map(table => (
        <Table
          key={table.id}
          id={table.id}
          name={table.name}
          seatCount={table.seatCount}
        />
      ))}
    </div>
  );
};

export default SeatingChart;
