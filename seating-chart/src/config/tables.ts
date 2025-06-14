// src/config/tables.ts

export type TableConfig = {
  id: string;
  name: string;
  seatCount: number;
};

export const defaultTables: TableConfig[] = [
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `table-${i + 1}`,
    name: `Table ${i + 1}`,
    seatCount: 10,
  })),
  {
    id: 'head-table',
    name: 'Head Table',
    seatCount: 16,
  },
];