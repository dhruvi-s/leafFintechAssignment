export interface TaxType {
  id: number;
  name: string;
  extra_value: string;
}
export interface TaxTypeResponse {
  status: number;
  message: string;
  obj: TaxType[];
}
