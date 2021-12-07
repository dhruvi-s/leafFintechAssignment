export interface AllDevicesResponse {
    status : number
    message : number
    obj: [
        {
            device_id: number,
            device_name: string,
            status: number,
            last_failure_time: number,
            last_restore_time: number
        },
        
    ],
    gaiaID: string
}