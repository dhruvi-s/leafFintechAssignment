export interface Center {
    id: number;
    name: string;
}

export interface CenterResponse {
    status: number;
    message: string;
    obj: Center[];
  }
