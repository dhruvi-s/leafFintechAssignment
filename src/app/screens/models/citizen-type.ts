export interface CitizenType {
  id: number;
  name: string;
  extra_value?: any;
}
export interface CitizenTypeResponse {
  status: number;
  message: string;
  obj: CitizenType[];
}
