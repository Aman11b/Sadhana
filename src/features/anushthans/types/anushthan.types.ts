export type AnushthanMantra = {
  name: string;
  targetMalas: number;
};
export type AnushthanStotra = {
  name: string;
  targetRecitations: number;
};
export type Anushthan = {
  id: string;
  startDate: string;
  durationDays: number;
  status: "ongoing" | "completed" | "incomplete";
  mantra: AnushthanMantra | null;
  stotra: AnushthanStotra | null;
};

export type OngoingAnushthanCardProps = {
  type: "mantra" | "stotra";
  name: string;
  target: number;
  completed: number;
} & Pick<Anushthan, "startDate" | "durationDays">;
