export interface DevicesByOutageResponse {
    success: number;
    message: string;
    obj: DataPowerByOutages []
    gaiaID: string
}

export interface DataPowerByOutages {
    date: string,
    device_id: number,
    device_name: string,
    location: string,
    msisdn: string,
    status: number,
    total_outrages: number,
    total_mins_outrages: string,
    alerts_recipents: string,
    outrages: [
        {
            outrage_id: number,
            device_id: number,
            device_name: string,
            failure_time: number,
            restore_time: number,
            status: number
        }

    ]
}