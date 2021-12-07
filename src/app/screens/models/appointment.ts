import { ScheduleTaxpreparer } from "./schedule-taxprepare";

export interface Appointment {
  is_landline: string;
  meeting_type: string;
  appointment_id: number;
  tax_preparer_id: number;
  site_id: number;
  tax_type: number;
  client_name: string;
  client_type: number;
  client_address: string;
  client_address2: string;
  client_phone_no: string;
  client_email: string;
  zip_code: string;
  appointment_date: string;
  appointment_start_time: string;
  appointment_end_time: string;
  time_interval: string;
  update_count: number;
  created_date: string;
  updated_date?: any;
  is_deleted: number;
  deleted_date?: any;
  tax_type_name: string;
  client_type_name: string;
  meeting_type_name: string;
  appointments: ScheduleTaxpreparer;
}
export interface AppointmentListResponse {
  status: number;
  message: string;
  obj: Appointment[];
}

export interface AppointmentDetailResponse {
  status: number;
  message: string;
  obj: Appointment;
}
