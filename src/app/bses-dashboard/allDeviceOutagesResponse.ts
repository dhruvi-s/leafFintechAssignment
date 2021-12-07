export interface AllDevicesByOutageResponse {
    success: number;
    message: string;
    obj: AllDevicesData []
               
    gaiaID: string
}

export interface AllDevicesData {
    device_name: string,
    total_outrages: number,
    total_mins_outrages: string,
    last_failure_time: string,
    last_restore_time: string,
    status: number
}