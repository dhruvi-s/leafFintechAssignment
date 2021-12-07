export interface DayFull {
  date: string;
  isFull: number;
}
export interface DayFullResponse {
  status: number;
  message: string;
  obj: DayFull[];
}
