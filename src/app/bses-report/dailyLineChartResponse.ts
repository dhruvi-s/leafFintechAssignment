export interface DailyLineChartResponse {
    status: number,
    message: string,
    obj: [
        {
            no_of_outrages: number ,
            mins:string ,
            created_at: string
        }
    ],
    gaiaID: number

}