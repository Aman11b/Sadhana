import type { Anushthan } from "../types/anushthan.types";

export const mockAnushthan: Anushthan = {
  id: "anushthan-001",
  startDate: "2026-11-10",
  durationDays: 21,
  status: "ongoing",

  mantra: {
    name: "Devi mantra",
    targetMalas: 100,
  },

  stotra: {
    name: "Kal bhiarav astakam",
    targetRecitations: 42,
  },
};

// Temporary mock daily records.
// Missing dates have no entry in this array.

export type MockDailyAnushthanRecord = {
  id: string;
  date: string;
  anushthanId: string;
  mantraMalas: number;
  stotraRecitations: number;
};

export const mockDailyAnushthanRecords: MockDailyAnushthanRecord[] = [
  {
    id: "record-001",
    date: "2026-11-10",
    anushthanId: "anushthan-001",
    mantraMalas: 5,
    stotraRecitations: 2,
  },
  {
    id: "record-002",
    date: "2026-11-11",
    anushthanId: "anushthan-001",
    mantraMalas: 4,
    stotraRecitations: 1,
  },
  {
    id: "record-003",
    date: "2026-11-12",
    anushthanId: "anushthan-001",
    mantraMalas: 0,
    stotraRecitations: 3,
  },
  {
    id: "record-004",
    date: "2026-11-14",
    anushthanId: "anushthan-001",
    mantraMalas: 6,
    stotraRecitations: 0,
  },
  {
    id: "record-005",
    date: "2026-11-16",
    anushthanId: "anushthan-001",
    mantraMalas: 3,
    stotraRecitations: 2,
  },
  {
    id: "record-006",
    date: "2026-11-17",
    anushthanId: "anushthan-001",
    mantraMalas: 6,
    stotraRecitations: 4,
  },
];
