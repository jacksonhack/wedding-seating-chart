// src/config/tables.ts

export type TableConfig = {
  id: string;
  name: string;
  seatCount: number;
};

export const defaultTables: TableConfig[] = [
  {
    id: 'head-table',
    name: 'Head Table',
    seatCount: 18,
  },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `table-${i + 1}`,
    name: `Table ${i + 1}`,
    seatCount: 10,
  })),
];