export interface SummaryDataResponse {
    success:number;
    message:string;
    obj:{
        locations : number
        total_outrages : number
        total_min_outrages : string
    },
    gaiaID: string
  }