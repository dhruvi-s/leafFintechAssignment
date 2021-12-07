export interface Zipcode {
    id:string;
    name:string;
}

export interface ZipcodeResponse{
    status: number;
    message: string;
    obj: Zipcode[];
}
