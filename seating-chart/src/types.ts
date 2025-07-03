export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  groupId?: string | null;
  assigned_table?: string | null;
  seatPosition?: number | null;
};

export type TableConfig = {
  id: string;
  name: string;
  seatCount: number;
};
